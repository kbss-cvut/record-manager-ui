variable "kc_admin_user" {
  description = "Keycloak username"
  type        = string
}

variable "kc_admin_password" {
  description = "Keycloak password"
  type        = string
  sensitive   = true
}

variable "kc_url" {
  description = "Keycloak server URL"
  type        = string
  default     = "http://localhost:8080"
}

variable "kc_realm" {
  description = "Keycloak realm name"
  type        = string
}