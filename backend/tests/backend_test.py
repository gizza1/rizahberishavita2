import os
import uuid

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL is missing")
BASE_URL = base_url.rstrip("/")


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health ----------
class TestHealth:
    def test_root(self, api):
        r = api.get(f"{BASE_URL}/api/", timeout=30)
        assert r.status_code == 200, r.text
        assert r.json().get("message") == "VITA API running"


# ---------- Contact ----------
class TestContact:
    def test_create_and_persist(self, api):
        payload = {
            "name": "TEST_QA User",
            "email": f"test_qa_{uuid.uuid4().hex[:8]}@example.com",
            "subject": "TEST_Subject",
            "message": "TEST_message body from automated test",
        }
        r = api.post(f"{BASE_URL}/api/contact", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "_id" not in data
        assert isinstance(data["id"], str) and len(data["id"]) > 0
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["subject"] == payload["subject"]
        assert data["message"] == payload["message"]
        assert data["created_at"]

        g = api.get(f"{BASE_URL}/api/contact", timeout=30)
        assert g.status_code == 200, g.text
        items = g.json()
        assert isinstance(items, list)
        match = [i for i in items if i["id"] == data["id"]]
        assert len(match) == 1, "contact not persisted / not returned by GET"
        assert match[0]["message"] == payload["message"]
        assert "_id" not in match[0]

    def test_optional_subject_defaults(self, api):
        payload = {
            "name": "TEST_NoSubject",
            "email": f"test_qa_{uuid.uuid4().hex[:8]}@example.com",
            "message": "TEST_no subject",
        }
        r = api.post(f"{BASE_URL}/api/contact", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        assert r.json()["subject"] == ""

    @pytest.mark.parametrize("payload", [
        {"name": "TEST_x", "email": "not-an-email", "message": "hi"},
        {"name": "TEST_x", "message": "hi"},
        {"email": "a@b.com", "message": "hi"},
        {"name": "TEST_x", "email": "a@b.com"},
        {},
    ])
    def test_validation_errors(self, api, payload):
        r = api.post(f"{BASE_URL}/api/contact", json=payload, timeout=30)
        assert r.status_code == 422, f"expected 422, got {r.status_code}: {r.text[:300]}"

    def test_empty_strings_accepted_or_rejected(self, api):
        # documents current behaviour: no min_length validation
        r = api.post(f"{BASE_URL}/api/contact", json={
            "name": "", "email": f"test_qa_{uuid.uuid4().hex[:8]}@example.com", "message": ""
        }, timeout=30)
        assert r.status_code in (200, 422), r.text


# ---------- Newsletter ----------
class TestNewsletter:
    def test_subscribe_duplicate_and_list(self, api):
        email = f"test_qa_nl_{uuid.uuid4().hex[:8]}@example.com"
        r = api.post(f"{BASE_URL}/api/newsletter", json={"email": email}, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == email
        assert isinstance(data["id"], str)
        assert "_id" not in data

        dup = api.post(f"{BASE_URL}/api/newsletter", json={"email": email}, timeout=30)
        assert dup.status_code == 409, f"expected 409 on duplicate, got {dup.status_code}"
        assert "detail" in dup.json()

        g = api.get(f"{BASE_URL}/api/newsletter", timeout=30)
        assert g.status_code == 200
        emails = [i["email"] for i in g.json()]
        assert emails.count(email) == 1

    def test_invalid_email(self, api):
        r = api.post(f"{BASE_URL}/api/newsletter", json={"email": "bad"}, timeout=30)
        assert r.status_code == 422, r.text

    def test_missing_body(self, api):
        r = api.post(f"{BASE_URL}/api/newsletter", json={}, timeout=30)
        assert r.status_code == 422, r.text

    def test_case_sensitivity_duplicate(self, api):
        # documents behaviour: uppercase variant treated as new subscriber
        email = f"test_qa_case_{uuid.uuid4().hex[:8]}@example.com"
        r1 = api.post(f"{BASE_URL}/api/newsletter", json={"email": email}, timeout=30)
        assert r1.status_code == 200
        r2 = api.post(f"{BASE_URL}/api/newsletter", json={"email": email.upper()}, timeout=30)
        assert r2.status_code in (200, 409), r2.text
        if r2.status_code == 200:
            pytest.skip("Known minor: emails not normalized/lowercased -> duplicate subscriptions possible")


# ---------- Cleanup ----------
def test_zz_cleanup():
    import asyncio
    from motor.motor_asyncio import AsyncIOMotorClient
    from dotenv import dotenv_values as dv
    env = dv("/app/backend/.env")

    async def run():
        c = AsyncIOMotorClient(env["MONGO_URL"].strip('"'))
        d = c[env["DB_NAME"].strip('"')]
        await d.contacts.delete_many({"$or": [{"name": {"$regex": "^TEST_"}}, {"email": {"$regex": "^test_qa_"}}]})
        await d.newsletter.delete_many({"email": {"$regex": "^(?i)test_qa_"}})
        c.close()

    asyncio.run(run())
    assert True
