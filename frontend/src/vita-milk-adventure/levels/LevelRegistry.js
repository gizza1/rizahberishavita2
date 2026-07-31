import { VitaFarm } from "./EasyLevel";
import { VitaProcessingFactory } from "./MediumLevel";
import { VitaMegaFactory } from "./HardLevel";

export const LEVELS = [VitaFarm, VitaProcessingFactory, VitaMegaFactory];
export const getLevel = (id) => LEVELS.find((level) => level.id === id) || LEVELS[0];
