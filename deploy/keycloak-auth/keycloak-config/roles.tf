variable "roles" {
  type = map(string)
  default = {
    read-all-records-role = <<EOT
Allows users to read all records in the system, regardless of the organization they belong to.
EOT
    write-all-records-role = <<EOT
Allows users to create, update, or delete any record in the system, regardless of organization.
EOT
    read-organization-records-role = <<EOT
Allows users to read records belonging to their own organization only.
EOT
    write-organization-records-role = <<EOT
Allows users to create, update, or delete records within their own organization only.
EOT
    complete-records-role = <<EOT
Allows users to mark records as complete.
EOT
    reject-records-role = <<EOT
Allows users to reject records.
EOT
    publish-records-role = <<EOT
Allows users to publish records.
EOT
    import-codelists-role = <<EOT
Allows users to import codelists into the system.
EOT
    comment-record-questions-role = <<EOT
Allows users to add comments to questions in records.
EOT
    read-all-users-role = <<EOT
Allows users to view the details of all users in the system, regardless of their organization.
EOT
    write-all-users-role = <<EOT
Allows users to create, update, or delete any user account in the system, including modifying user attributes.
EOT
    read-organization-users-role = <<EOT
Allows users to view the details of users within their own organization only.
EOT
    write-organization-users-role = <<EOT
Allows users to create, update, or delete user accounts within their own organization only.
EOT
    read-organization-role = <<EOT
Allows users to view details about the user’s own organization, such as its name or email.
EOT
    write-organization-role = <<EOT
Allows users to modify their own organization’s details, such as updating its name or email.
EOT
    read-all-organizations-role = <<EOT
Allows users to view details of all organizations in the system.
EOT
    write-all-organizations-role = <<EOT
Allows users to create, update, or delete any organization in the system.
EOT
    read-action-history-role = <<EOT
Allows users to view the history of operations performed in the system.
EOT
    read-statistics-role = <<EOT
Allows users to view statistical reports about the system’s data.
EOT
  }
}

resource "keycloak_role" "realm_roles" {
  for_each  = var.roles

  realm_id    = var.kc_realm
  name        = each.key
  description = length(each.value) > 0 ? each.value : null
}

# --- Impersonation role composite ---
data "keycloak_openid_client" "realm_management" {
  realm_id = var.kc_realm
  client_id = "realm-management"
}

data "keycloak_role" "realm_management_impersonation" {
  realm_id  = var.kc_realm
  client_id = data.keycloak_openid_client.realm_management.id
  name      = "impersonation"
}

resource "keycloak_role" "impersonate_role_composite" {
  realm_id = var.kc_realm
  name     = "impersonate-role"
  composite_roles = [
    data.keycloak_role.realm_management_impersonation.id
  ]
}
