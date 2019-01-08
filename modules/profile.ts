import { IProfile } from "types/profile";

/**
 * Calculates how deep a profile is in a hierarchy of profiles.
 * @param profiles {IProfile[]} The hierarchy of profiles.
 * @param profileToFind {IProfile} The profile to find.
 * @param level {number?} The depth level when no profile is found. Defaults to 0.
 * @return {number} The depth level.
 */
export const deepLevel = (
  profiles: IProfile[],
  profileToFind: IProfile,
  level: number = 0
): number => {
  return profiles.reduce((depth, profile: IProfile) => {
    if (profile.EmployeeId === profileToFind.EmployeeId) {
      return level + 1;
    } else if (profile.children) {
      const deepDepth = deepLevel(profile.children, profileToFind, level + 1);
      if (deepDepth) {
        return deepDepth;
      }
    }
    return depth;
  }, 0);
};

/**
 * Searches a hierarchy of profiles for one that matches a specified employee ID.
 * @param profiles {IProfile[]} The profile hierarchy.
 * @param id {number} The employee ID to find.
 * @return {IProfile | null} The matched profile, or null if not found.
 */
export const findProfile = (
  profiles: IProfile[],
  id: number
): IProfile | null => {
  return profiles.reduce((matchedProfile: IProfile | null, currProfile) => {
    if (!matchedProfile) {
      if (currProfile.EmployeeId === id) {
        return currProfile;
      } else if (currProfile.children) {
        return findProfile(currProfile.children, id);
      } else {
        return null;
      }
    }
    return matchedProfile;
  }, null);
};
