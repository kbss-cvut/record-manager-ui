variable "roles" {
  type = map(string)
  default = {
    read-all-records-role                 = "",
    write-all-records-role                = "",
    read-organization-records-role        = "",
    write-organization-records-role       = "",
    complete-records-role                 = "",
    reject-records-role                   = "",
    publish-records-role                  = "",
    import-codelists-role                 = "",
    comment-record-questions-role         = "",
    read-all-users-role                   = "",
    write-all-users-role                  = "",
    read-organization-users-role          = "",
    write-organization-users-role         = "",
    read-organization-role                = "",
    write-organization-role               = "",
    read-all-organizations-role           = "",
    write-all-organizations-role          = "",
    read-action-history-role              = "",
    read-statistics-role                  = "",
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
