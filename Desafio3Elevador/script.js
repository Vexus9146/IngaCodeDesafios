const elevador = document.querySelector(".elevador");
const passageiro = document.getElementById("passageiro");
const entrarBtn = document.getElementById("entrar");
const painel = document.getElementById("painel");
const botoesPainel = document.querySelectorAll(".painel-btn");
const botoesChamada = document.querySelectorAll(".chamada");
const somAndar = document.getElementById("somAndar");

let elevadorAndar = 1;
let passageiroAndar = 1;
let passageiroDentro = false;
let fila = [];
let emMovimento = false;
let timeoutRetorno = null;

const alturaAndar = 120;
const totalAndares = 4;

function atualizarPassageiroFora() {
  const predio = document.getElementById("predio");
  const andarElem = predio.querySelector(`.andar[data-andar='${passageiroAndar}']`);
  const predioRect = predio.getBoundingClientRect();
  const andarRect = andarElem.getBoundingClientRect();

  passageiro.style.position = "absolute";
  passageiro.style.bottom = `${(passageiroAndar - 1) * alturaAndar}px`;
  passageiro.style.left = `${-passageiro.offsetWidth - 10}px`; 
  passageiro.style.display = "block";

  entrarBtn.classList.toggle(
    "escondido",
    !(elevadorAndar === passageiroAndar && !emMovimento && !passageiroDentro)
  );
}
atualizarPassageiroFora();

function moverElevador(andar) {
  elevador.style.bottom = `${(andar - 1) * alturaAndar}px`;
  elevadorAndar = andar;
  somAndar.play();
}

function retornoAutomatico() {
  if (timeoutRetorno) clearTimeout(timeoutRetorno);
  if (!emMovimento && fila.length === 0 && elevadorAndar !== 1) {
    timeoutRetorno = setTimeout(() => {
      fila.push(1);
      processarFila();
      timeoutRetorno = null;
    }, 5000);
  }
}

function processarFila() {
  if (fila.length === 0) {
    emMovimento = false;
    retornoAutomatico();
    atualizarPassageiroFora();
    return;
  }

  emMovimento = true;
  const proximoAndar = fila.shift();
  moverElevador(proximoAndar);

  setTimeout(() => {
    if (passageiroDentro) {
      passageiroDentro = false;
      passageiro.classList.remove("passageiro-dentro");
      document.getElementById("passageiro-area").appendChild(passageiro);
      passageiroAndar = proximoAndar;
      atualizarPassageiroFora(); 
      painel.classList.add("escondido");
    }

    emMovimento = false;
    atualizarPassageiroFora();

    if (fila.length > 0) processarFila();
    else retornoAutomatico();
  }, 2000);
}

entrarBtn.addEventListener("click", () => {
  if (elevadorAndar !== passageiroAndar || emMovimento) return;

  passageiroDentro = true;
  painel.classList.remove("escondido");

  passageiro.style.left = "10px";
  setTimeout(() => {
    passageiro.style.display = "none";
    elevador.appendChild(passageiro);
    passageiro.classList.add("passageiro-dentro");
  }, 500);

  atualizarPassageiroFora();
});

botoesPainel.forEach(btn => {
  btn.addEventListener("click", () => {
    const andar = Number(btn.dataset.andar);
    if (!fila.includes(andar)) fila.push(andar);
    if (!emMovimento) processarFila();
  });
});

botoesChamada.forEach(btn => {
  btn.addEventListener("click", e => {
    const andar = Number(e.target.closest(".andar-chamada").dataset.andar);
    if (!fila.includes(andar)) fila.push(andar);
    if (!emMovimento) processarFila();
  });
});
