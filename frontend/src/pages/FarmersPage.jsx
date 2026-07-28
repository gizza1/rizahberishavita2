import { FarmToTable } from "../components/site/FarmToTable";
import { FarmSourcing } from "../components/site/FarmSourcing";

export default function FarmersPage() {
  return (
    <div className="pt-20">
      <FarmSourcing />
      <FarmToTable />
    </div>
  );
}
