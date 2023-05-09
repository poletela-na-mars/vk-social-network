import { UserData } from './UserData';

export interface PeopleListProps {
  section: string | null;
  usersData: UserData[] | undefined;
  areMyFriends: boolean;
  authData: UserData | undefined;
  peopleListUpdateData: (value: string) => void;
  searchReq: string;
}
