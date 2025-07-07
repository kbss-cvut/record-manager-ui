

variable "groups" {
  type = list(string)

  default = ["AdminGroup", "UserGroup"]
}

resource "keycloak_group" "realm_groups" {
  for_each  = toset(var.groups)

  realm_id = var.kc_realm
  name     = each.value
}

resource "keycloak_group_roles" "admin_group_roles" {
  realm_id = var.kc_realm
  group_id = keycloak_group.realm_groups["AdminGroup"].id

  role_ids = [for role in keycloak_role.realm_roles : role.id]
}

