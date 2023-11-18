import { User } from '../models/user.dto';
import { UserFullnamePipe } from './user-fullname.pipe';

describe('UserFullnamePipe', () => {
  let pipe: UserFullnamePipe;

  beforeEach(() => {
    pipe = new UserFullnamePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('return Surname, Name', () => {
    const user = new User();
    user.Surname = 'Doe';
    user.Name = 'John';

    const expected = `${user.Surname}, ${user.Name}`;
    const actual = pipe.transform(user);

    expect(actual).toEqual(expected);
  });
});
