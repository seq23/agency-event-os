import type { IncidentLogRecord, ProductionTaskRecord, WhiteLabelBackupRoomRecord } from "@/types/productionPersistence";

export function summarizeProductionWorkflow(input: {
  tasks: ProductionTaskRecord[];
  incidents: IncidentLogRecord[];
  backupRooms: WhiteLabelBackupRoomRecord[];
}) {
  return {
    totalTasks: input.tasks.length,
    openTasks: input.tasks.filter((task) => !["done", "cancelled"].includes(task.status)).length,
    blockingTasks: input.tasks.filter((task) => task.blockingEventReadiness && task.status !== "done").length,
    openIncidents: input.incidents.filter((incident) => incident.status !== "resolved").length,
    configuredBackupRooms: input.backupRooms.filter((room) => ["configured", "tested"].includes(room.status)).length,
  };
}

export function canActivateWhiteLabelBackupRoom(room: WhiteLabelBackupRoomRecord, producerApproved: boolean) {
  if (!room.activationRequiresProducerApproval) {
    return true;
  }
  return producerApproved;
}
