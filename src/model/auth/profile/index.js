import PropTypes from "prop-types";
export const UserProps = PropTypes.shape({
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    email: PropTypes.string,
    is_staff: PropTypes.bool,
    is_superuser: PropTypes.bool,
  }).isRequiredButNullable,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  full_name: PropTypes.string,
  username: PropTypes.string,
  display_name: PropTypes.string,
  avatar: PropTypes.string,
  organization: PropTypes.string,
  about: PropTypes.string,
  timezone: PropTypes.string,
  language: PropTypes.shape({
    id: PropTypes.number,
    key: PropTypes.string,
    name: PropTypes.string,
    short_name: PropTypes.string,
    common_name: PropTypes.string,
    ace: PropTypes.string,
    pygments: PropTypes.string,
    template: PropTypes.string,
    info: PropTypes.string,
    description: PropTypes.string,
    extension: PropTypes.string,
  }),
  performance_points: PropTypes.number,
  problem_count: PropTypes.number,
  points: PropTypes.number,
  rating: PropTypes.number,
});
