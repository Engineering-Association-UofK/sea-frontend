export const roles = [
    {value: "sys:super_admin", name: "Super Admin"},
    {value: "sys:admin", name: "Admin"},
    {value: "sys:admin_manager", name: "Admins Manager"},
    {value: "sys:user_manager", name: "Users Manager"},
    {value: "sys:tech_support", name: "Technical Support"},
    {value: "content:blog_manager", name: "Blogs Manager"},
    {value: "content:form_manager", name: "Form Manager"},
    {value: "content:event_manager", name: "Event Manager"},
    {value: "content:editor", name: "Content Editor"},
    {value: "cert:manager", name: "Certificates Manager"},
    {value: "cert:certifier", name: "Paper Certifier"},
    {value: "cert:viewer", name: "Certificates Viewer"},
    // {value: "ROLE_ADMIN_MANAGER", name: "Admins Manager"},
    // {value: "ROLE_CERTIFICATE_ISSUER", name: "Certificates Issuer"},
]

export const ADMIN_ROLES = roles.map((role) => role.value); //["sys:admin", "sys:super_admin", "sys:user_manager", "sys:tech_support", "content:editor", "content:blog_manager", "content:event_manager", "content:form_manager", "cert:certifier", "cert:manager", "cert:viewer"];
export const ADMIN_ROLES_NAMES = roles.map((role) => role.name);

export const displayRole = (roleValue) => {
    const filteredRoles = roles.filter((role) => role.value == roleValue)
    return filteredRoles.length > 0 ? filteredRoles[0].name : ''
}