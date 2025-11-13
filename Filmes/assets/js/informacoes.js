const token ="eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZmY1MzNhMDVjY2FjYWY1NDc4OTU5ZThkN2NkM2E4ZiIsIm5iZiI6MTc2MjYzNzYxOC4yMTQwMDAyLCJzdWIiOiI2OTBmYjczMjdiZTNjMDc4NmFjZTgzOWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.KIgNsBkiVDKw-z5EscjkbPKFgGa-ImAL_KfhycLG9R8";
// api utilizada -> TMDB (The Movie Database)
// esse eh meu token, caso alguem queira testa :) sei que nao eh certo deixar publico mas como eh so atividade eu deixei

// esse bloco recebe a URL definida no index.html e define os parametros
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const categoria = urlParams.get("categoria");
// montagem da url do filme/serie
const url = `https://api.themoviedb.org/3/${categoria}/${id}?language=pt-BR&append_to_response=videos,person`;

// pega os dados da api
async function pegarDataAPI(url) {
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Erro ao buscar dados da API: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (Error) {
    return;
  }
}

// recebe os dados dos diretores (nem todos possuem essa info)
function pegarDiretores(objeto) {
  const diretores = [];

  if (!objeto.created_by || !Array.isArray(objeto.created_by)) {
    return diretores;
  }

  objeto.created_by.forEach((e) => {
    const diretor = {
      nome: e.name,
      perfil: e.profile_path
        ? `https://image.tmdb.org/t/p/w200${e.profile_path}`
        : "https://via.placeholder.com/200x300/333/fff?text=Sem+Imagem",
    };
    diretores.push(diretor);
  });
  return diretores;
}

// prepara a pagina, substituindo o que precisa
async function prepararPagina() {
  const objeto = await pegarDataAPI(url);
  const diretores = pegarDiretores(objeto);

  const divInfosGerais = document.querySelector("#infos-gerais");
  divInfosGerais.querySelector("h1").textContent = `| ${
    categoria === "movie" ? objeto.title : objeto.name
  }`;
  divInfosGerais.querySelector("h2").textContent = `${
    categoria === "movie" ? objeto.original_title : objeto.original_name
  }`;

  divInfosGerais.querySelector("p").textContent = `${
    categoria === "movie"
      ? objeto.release_date.slice(0, 4)
      : objeto.first_air_date.slice(0, 4) +
        " - " +
        objeto.number_of_seasons +
        " temp. - " +
        objeto.number_of_episodes +
        " eps."
  } `;

  const divVisuais = document.querySelector("#visuais");
  divVisuais.querySelector(
    "img"
  ).src = `https://image.tmdb.org/t/p/original${objeto.poster_path}`;

  const key = objeto.videos?.results?.[0]?.key;
  if (key) {
    divVisuais.querySelector(
      "iframe"
    ).src = `https://www.youtube.com/embed/${key}?autoplay=1&controls=0&start=0&end=15&modestbranding=1&rel=0&showinfo=0`;
  }

  const divGeneros = document.querySelector("#generos-container ul");
  objeto.genres.forEach((e) => {
    const generoP = document.createElement("li");
    generoP.textContent = e.name;
    divGeneros.append(generoP);
  });

  document.querySelector("#sinopse p").textContent = objeto.overview;

  const divDiretores = document.querySelector("#diretores");
  diretores.forEach((e) => {
    const diretor = document.createElement("div");
    diretor.innerHTML = `
            <img src="${e.perfil}" alt="${
      e.nome + " foto"
    }" onerror="this.src='https://via.placeholder.com/200x300/333/fff?text=Sem+Imagem'"/>
            <p>${e.nome}</p>
        `;
    divDiretores.append(diretor);
  });

  document.querySelector("#avaliacao h4").textContent =
    "⭐ " + String(objeto.vote_average).slice(0, 3);

    document.querySelector("#href-filme").href = objeto.homepage;
    document.querySelector("#mais-informacoes").href = `https://m.imdb.com/pt/title/${objeto.imdb_id}/`
}

// quando a pagina carregar, prepara ela
window.addEventListener("load", async () => prepararPagina());
