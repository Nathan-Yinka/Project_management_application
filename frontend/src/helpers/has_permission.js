export const hasPermission = (permissions,permission) => {
    // console.log("the permission that you have is ",organizationDetails)
     return permissions?.includes(permission) || false;
   };