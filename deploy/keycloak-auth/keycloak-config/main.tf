terraform {
  required_providers {
    keycloak = {
      source  = "keycloak/keycloak"
      version = ">= 5.0.0"
    }
  }
}

provider "keycloak" {
  client_id = "admin-cli"
  username  = var.kc_admin_user
  password  = var.kc_admin_password
  url       = var.kc_url
}

resource "keycloak_realm" "realm" {
  realm                 = var.kc_realm
  access_token_lifespan = var.kc_access_token_lifespan
}
