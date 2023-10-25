import { RatingPipe } from './rating.pipe';

describe('RatingPipe', () => {
  let pipe: RatingPipe;

  beforeEach(() => {
    pipe = new RatingPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('no rating should not trigger a division by zero', () => {
    const expected = 0;
    const actual = pipe.transform(0, 0);

    expect(actual).toEqual(expected);
  });

  it('calculate a simple rating', () => {
    const expected = 5;
    const actual = pipe.transform(10, 0);

    expect(actual).toEqual(expected);
  });

  it('calculate a more complex rating', () => {
    const expected = 4; // 10*5/(10+5) ceil
    const actual = pipe.transform(10, 5);

    expect(actual).toEqual(expected);
  });
});
