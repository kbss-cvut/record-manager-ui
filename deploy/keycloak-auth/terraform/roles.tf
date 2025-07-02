variable "roles" {
  type = map(string)
  default = {
    rm-delete-all-records         = ""
    rm-edit-users                = ""
    rm-impersonate               = ""
    rm-edit-all-records           = ""
    rm-view-organization-records = ""
    rm-complete-records           = ""
    rm-edit-organization-records = ""
    rm-view-all-records           = ""
    rm-delete-organization-records = ""
    rm-publish-records            = ""
    rm-import-codelists           = ""
    rm-reject-records             = ""
  }
}

resource "keycloak_role" "realm_roles" {
  for_each  = var.roles

  realm_id    = var.kc_realm
  name        = each.key
  description = length(each.value) > 0 ? each.value : null
}