export const ROLES = {
  POLICE: 'police',
  TOURISM: 'tourism',
};

export const can = {
  viewContact: (role) => role === ROLES.POLICE,
  trackLive:   (role) => role === ROLES.POLICE,
  fileEFIR:    (role) => role === ROLES.POLICE,
  finalResolve:(role) => role === ROLES.POLICE,
  tourismLimited: (role) => role === ROLES.TOURISM,
};
