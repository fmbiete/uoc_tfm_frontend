import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rating',
  standalone: true,
  pure: true,
})
export class RatingPipe implements PipeTransform {
  transform(likes: number, dislikes: number): number {
    const totalReviews = likes + dislikes;
    if (totalReviews == 0) {
      return 0;
    }

    // pct over 1.0
    const pctLiked = likes / totalReviews;
    const valueRating = Math.ceil(pctLiked * 5.0);
    return valueRating;
  }
}
