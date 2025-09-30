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
    read-statistics-role                  = ""
  }
}

resource "keycloak_role" "realm_roles" {
  for_each  = var.roles

  realm_id    = var.kc_realm
  name        = each.key
  description = length(each.value) > 0 ? each.value : null
}
