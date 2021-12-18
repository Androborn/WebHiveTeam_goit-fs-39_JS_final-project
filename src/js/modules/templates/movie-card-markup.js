export function movieCardMarkup(cards) {
  return cards
    .map(
      ({ id, poster_path, title, genre_ids, release_date, vote_average }) =>
        `<li class="card-list__item" id="${id}">
        <img class="card-list__img" src=${
          poster_path === null
            ? sorryPosterImage
            : `https://image.tmdb.org/t/p/w500${poster_path}`
        } alt="${title}" />
        <div class="card-list__info">
          <h2 class="card-list__info-name">${this.slicedOriginalTitle(
            title,
          )}</h2>
          <div class="card-list__description">
             <p class="card-list__genre">${
               this.createGenresList(genre_ids)
                 ? this.createGenresList(genre_ids)
                 : noGenre
             }</p>
            <p class="card-list__date">| ${this.correctedDate(release_date)}</p>
            <span class="card-list__rating">${vote_average}</span>
          </div>
        </div>
      </li>`,
    )
    .join('');
}
