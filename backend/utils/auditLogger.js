import AuditLog from "../models/auditLogModel.js";

export const createAuditLog = async ({
  user,
  action,
  entityType,
  entityId,
  oldValue = null,
  newValue = null,
  ipAddress = null,
}) => {
  try {
    await AuditLog.create({
      user,
      action,
      entityType,
      entityId,
      oldValue,
      newValue,
      ipAddress,
    });
  } catch (error) {
    console.error("Audit log failed:", error.message);
  }
};