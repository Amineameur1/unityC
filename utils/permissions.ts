const permissions = {
  Owner: {
    employees: ["create", "read", "update", "delete"],
    departments: ["create", "read", "update", "delete"],
    sub_departments: ["create", "read", "update", "delete"],
    resources: ["create", "read", "update", "delete"],
    tasks: ["create", "read", "update", "delete"],
    announcements: ["create", "read", "update", "delete"],
    performance_metrics: ["create", "read", "update", "delete"],
    audit_logs: ["read"],
    salaries: ["read", "update"],
    company_settings: ["manage"],
  },
  Admin: {
    employees: ["read", "update"],
    departments: ["read", "update"],
    sub_departments: ["create", "read", "update", "delete"],
    resources: ["create", "read", "update"],
    tasks: ["create", "read", "update", "delete"],
    announcements: ["create", "read", "update", "delete"],
    performance_metrics: ["create", "read", "update"],
  },
  Employee: {
    employees: ["read"],
    tasks: ["read", "update"],
    departments: ["read"],
    resources: ["read"],
    announcements: ["read"],
    performance_metrics: ["read"],
  },
}

// دالة للتحقق من صلاحية محددة
export function hasPermission(role: string, resource: string, action: string): boolean {
  // إذا كان الدور غير موجود، ارجع false
  if (!permissions[role as keyof typeof permissions]) {
    return false
  }

  // احصل على صلاحيات الدور للمورد المحدد
  const rolePermissions = permissions[role as keyof typeof permissions][resource as keyof typeof permissions.Owner]

  // إذا كانت الصلاحيات غير موجودة، ارجع false
  if (!rolePermissions) {
    return false
  }

  // تحقق مما إذا كان الإجراء مسموحًا به
  return rolePermissions.includes(action)
}

// دالة للتحقق من نطاق الوصول
export function getScope(role: string): string {
  switch (role) {
    case "Owner":
      return "global"
    case "Admin":
      return "department"
    case "Employee":
      return "self && department"
    default:
      return "none"
  }
}
