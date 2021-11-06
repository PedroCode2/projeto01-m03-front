const lista = document.getElementById('lista');
const apiUrl = "http://localhost:3000/jogos";
let edicao = false;
let idEdicao = 0;



function toggle(){
  
  let jogado = document.querySelector(".jogado")
    
  if(jogado.classList.contains("bi-toggle2-off")){
      jogado.classList.replace("bi-toggle2-off", "bi-toggle2-on")
    }else{
      jogado.classList.replace("bi-toggle2-on", "bi-toggle2-off");
    }
    console.log("Deu Certo!!")
}

// Função para fazer com que a quantidade maxima seja de 0 a 10 para a nota do jogo!!


function maxLengthCheck(object) {
  if (object.value.length > object.maxLength)
    object.value = object.value.slice(0, object.maxLength);
}

function isNumeric(evt) {
  var theEvent = evt || window.event;
  var key = theEvent.keyCode || theEvent.which;
  key = String.fromCharCode(key);
  var regex = /[0-9]|\./;
  if (!regex.test(key)) {
    theEvent.returnValue = false;
    if (theEvent.preventDefault) theEvent.preventDefault();
  }
}

//começando a validar a aparição dos itens na tela..

let elementoNome = document.getElementById('nome');
let elementoImg = document.getElementById('imagem');
let elementoGen = document.getElementById('genero');
let elementoNota = document.getElementById('nota');

const getJogos = async () => {
  const response = await fetch(apiUrl);
  const jogos = await response.json();
  jogos.map((jogo) => {
    lista.insertAdjacentHTML(
      "beforeend",
      `
      <div class="col">
          <div class="card">
          <img src="${jogo.imagem}"  class="card-img-top" alt="..."width = "300" heigth = "300">
          <div class="card-body">
              <h5 class="card-title">${jogo.nome} -Nota: ${jogo.nota}/10</h5> 
              <span class="badge bg-dark">${jogo.genero}</span>
              <div> <i class="bi bi-toggle2-off jogado" onclick="toggle()">Jogado</i> </div>
              <div>
                  <button class="btn btn-dark" onclick="editJogo('${jogo.id}')">Editar</button>
                  <button class="btn btn-danger" onclick="deleteJogo('${jogo.id}')">Excluir</button>
              </div>
          </div>
          </div>
        </div>
  `
    );
  });
};
const submitForm = async (event) => {
  event.preventDefault();

  const jogo = {
    nome: nome.value,
    imagem: imagem.value,
    genero: genero.value,
    nota: parseInt(nota.value),
  };

  if (edicao) {
    putJogo(jogo, idEdicao);
  } else {
    criarJogo(jogo);
  }

  clearFields();
  lista.innerHTML = "";
};

const criarJogo = async (jogo) => {
  const request = new Request(`${apiUrl}/add`, {
    method: "POST",
    body: JSON.stringify(jogo),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });

  const response = await fetch(request);

  const result = await response.json();

  alert(result.message);

  getJogos();
};

const putJogo = async (jogo, id) => {
  const request = new Request(`${apiUrl}/editar/${id}`, {
    method: "PUT",
    body: JSON.stringify(jogo),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });
  const response = await fetch(request);
  const result = await response.json();

  alert(result.message);
  edicao = false;
  idEdicao = 0;
  getJogos();
};

const getJogosById = async (id) => {
  const response = await fetch(`${apiUrl}/${id}`);
  return await response.json();
}
const deleteJogo = async (id) => {
  const request = new Request(`${apiUrl}/delete/${id}`, {
    method: "DELETE",
  });

  const response = await fetch(request);
  const result = await response.json();

  alert(result.message);

  lista.innerHTML = "";
  getJogos();
};

const editJogo = async (id) => {
  edicao = true;
  idEdicao = id;

  const jogo = await getJogosById(id);

  nome.value = jogo.nome;
  imagem.value = jogo.imagem;
  genero.value = jogo.genero;
  nota.value = jogo.nota;
};

const clearFields = () => {
  nome.value = '';
  imagem.value = '';
  genero.value = '';
  nota.value = ''
}


getJogos()
