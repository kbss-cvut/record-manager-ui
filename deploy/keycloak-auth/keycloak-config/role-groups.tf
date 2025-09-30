# Define the role groups and their associated roles
variable "role_groups" {
  type = map(list(string))
  default = {
    admin-role-group = [
      "read-all-records-role",
      "write-all-records-role",
      "read-organization-records-role",
      "write-organization-records-role",
      "complete-records-role",
      "reject-records-role",
      "publish-records-role",
      "import-codelists-role",
      "comment-record-questions-role",
      "read-all-users-role",
      "write-all-users-role",
      "read-organization-users-role",
      "write-organization-users-role",
      "read-organization-role",
      "write-organization-role",
      "read-all-organizations-role",
      "write-all-organizations-role",
      "read-action-history-role",
      "read-statistics-role"
    ]
    data-collection-coordinator-role-group = [
      "read-all-users-role",
      "write-all-users-role",
      "read-organization-users-role",
      "write-organization-users-role",
      "read-organization-role",
      "write-organization-role",
      "read-all-organizations-role",
      "write-all-organizations-role",
      "read-organization-records-role",
      "write-organization-records-role",
      "comment-record-questions-role",
      "complete-records-role"
    ]
    organization-manager-role-group = [
      "read-organization-role",
      "write-organization-role",
      "read-organization-users-role",
      "write-organization-users-role",
      "read-organization-records-role",
      "write-organization-records-role",
      "comment-record-questions-role"
    ]
    entry-clerk-role-group = [
      "read-organization-role",
      "read-organization-records-role",
      "comment-record-questions-role"
    ]
    reviewer-role-group = [
      "complete-records-role",
      "comment-record-questions-role"
    ]
  }
}

# Create the groups
resource "keycloak_group" "role_groups" {
  for_each = var.role_groups

  realm_id = var.kc_realm
  name     = each.key
}

# Assign ALL roles to each group in a single resource
resource "keycloak_group_roles" "group_role_assignments" {
  for_each = var.role_groups

  realm_id = var.kc_realm
  group_id = keycloak_group.role_groups[each.key].id

  role_ids = [
    for role_name in each.value :
    keycloak_role.realm_roles[role_name].id
  ]
}