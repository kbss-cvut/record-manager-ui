#!/bin/bash

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [roles-configuration] $@"
}

log "Configuring ${REALM_ID} roles and role groups ..."

/opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080 --realm master --user ${KEYCLOAK_ADMIN} --password ${KEYCLOAK_ADMIN_PASSWORD}

declare -A ROLES
ROLES=(
  [rm-delete-all-records]=""
  [rm-edit-users]=""
  [rm-impersonate]=""
  [ROLE_USER]="Record Manager regular user role"
  [rm-edit-all-records]=""
  [rm-view-organization-records]=""
  [rm-complete-records]=""
  [ROLE_ADMIN]="Record Manager admin role"
  [rm-edit-organization-records]=""
  [rm-view-all-records]="",
  [rm-delete-organization-records]="",
  [rm-publish-records]="",
  [rm-import-codelists]="",
  [rm-reject-records]="",
)


log "Creating roles in realm ${REALM_ID} "
for ROLE in "${!ROLES[@]}"; do

  /opt/keycloak/bin/kcadm.sh get roles/${ROLE} -r ${REALM_ID} > /dev/null 2>&1
    if [ $? -eq 0 ]; then
      log "Role ${ROLE} already exists in realm ${REALM_ID}, exiting now."
      exit 0
    fi

  DESCRIPTION=${ROLES[$ROLE]}
  if [ -n "$DESCRIPTION" ]; then
    /opt/keycloak/bin/kcadm.sh create roles -r ${REALM_ID} -s name="$ROLE" -s description="$DESCRIPTION"
    else
    /opt/keycloak/bin/kcadm.sh create roles -r ${REALM_ID}   -s name="$ROLE"
  fi
done

log "All roles created in realm ${REALM_ID}"

log "Creating groups in realm ${REALM_ID}"

declare -a _GROUPS=("AdminGroup" "UserGroup")

for GROUP in "${_GROUPS[@]}"
do
  if /opt/keycloak/bin/kcadm.sh get groups -r ${REALM_ID} |  grep -oP '"name" : "\K[^"]+' | grep -Fx $GROUP > /dev/null 2>&1; then
     log "Group ${GROUP} already exists in realm ${REALM_ID}, exiting now."
     exit 0
  else
   /opt/keycloak/bin/kcadm.sh create groups -r "$REALM_ID" -s name="$GROUP"
  fi
done

log "All groups created in realm ${REALM_ID}"

log "Assigning roles to groups in realm ${REALM_ID}"
for ROLE in "${!ROLES[@]}"; do
     opt/keycloak/bin/kcadm.sh add-roles -r ${REALM_ID} --gname AdminGroup --rolename $ROLE
done

opt/keycloak/bin/kcadm.sh add-roles -r ${REALM_ID} --gname UserGroup --rolename ROLE_USER

log "All roles are assigned to groups in realm ${REALM_ID}"