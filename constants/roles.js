const roles = {
  default: 'default',
  premium: 'premium',
  admin: 'admin',
}

const rolesTitles = {
  [roles.default]: 'Стандарт',
  [roles.premium]: 'Премиум',
  [roles.admin]: 'Администратор',
}

module.exports = {
  roles,
  rolesTitles,
}