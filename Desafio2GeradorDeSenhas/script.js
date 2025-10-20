const tamanho = document.getElementById('tamanho');
const maiusculas = document.getElementById('maiusculas');
const minusculas = document.getElementById('minusculas');
const numeros = document.getElementById('numeros');
const simbolos = document.getElementById('simbolos');
const emojis = document.getElementById('emojis');
const gerar = document.getElementById('gerar');
const senhaOutput = document.getElementById('senha');
const copiar = document.getElementById('copiar');
const forcaSenha = document.getElementById('forcaSenha');

const chars = {
  maiusculas: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  minusculas: "abcdefghijklmnopqrstuvwxyz",
  numeros: "0123456789",
  simbolos: "!@#$%^&*()_+-=[]{}|;:,.<>/?",
  emojis: "😀😂🥰😎🤔👍🔥💥🎉❤️🍀🌟"
};

function gerarSenha() {
  let caracteres = "";
  const obrigatorios = []; 

  if (maiusculas.checked) {
    caracteres += chars.maiusculas;
    obrigatorios.push(chars.maiusculas[Math.floor(Math.random() * chars.maiusculas.length)]);
  }
  if (minusculas.checked) {
    caracteres += chars.minusculas;
    obrigatorios.push(chars.minusculas[Math.floor(Math.random() * chars.minusculas.length)]);
  }
  if (numeros.checked) {
    caracteres += chars.numeros;
    obrigatorios.push(chars.numeros[Math.floor(Math.random() * chars.numeros.length)]);
  }
  if (simbolos.checked) {
    caracteres += chars.simbolos;
    obrigatorios.push(chars.simbolos[Math.floor(Math.random() * chars.simbolos.length)]);
  }
  let emojiArray = [];
  if (emojis.checked) {
    emojiArray = Array.from(chars.emojis);
    obrigatorios.push(emojiArray[Math.floor(Math.random() * emojiArray.length)]);
  }

  if (!caracteres && emojiArray.length === 0) {
    senhaOutput.textContent = "Selecione pelo menos uma opção!";
    forcaSenha.textContent = "—";
    forcaSenha.style.backgroundColor = "transparent";
    return;
  }

  let senha = [...obrigatorios]; 

  while (senha.length < tamanho.value) {
    const usarEmoji = emojis.checked && Math.random() < 0.2; 
    if (usarEmoji) {
      const randIndex = Math.floor(Math.random() * emojiArray.length);
      senha.push(emojiArray[randIndex]);
    } else {
      const randIndex = Math.floor(Math.random() * caracteres.length);
      senha.push(caracteres[randIndex]);
    }
  }

  senha = senha.sort(() => Math.random() - 0.5);

  senhaOutput.textContent = senha.join('');
  avaliarForca(senhaOutput.textContent);
}


function avaliarForca(senha) {
  let forca = 0;

  if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>/?]/.test(senha)) forca += 2;

  if (/[\u{1F600}-\u{1F64F}]/u.test(senha)) forca += 2;

  if (/[0-9]/.test(senha)) forca += 1;

  if (/[A-Z]/.test(senha)) forca += 1;

  if (senha.length >= 6) forca += 1;  

  let texto = "", cor = "";
  if (forca <= 2) { 
    texto = "Fraca"; 
    cor = "red"; 
  } else if (forca <=4) { 
    texto = "Média"; 
    cor = "orange"; 
  } else { 
    texto = "Forte"; 
    cor = "green"; 
  }

  forcaSenha.textContent = texto;
  forcaSenha.style.backgroundColor = cor;
}



gerar.addEventListener('click', gerarSenha);

copiar.addEventListener('click', () => {
  if (senhaOutput.textContent && senhaOutput.textContent !== "Sua senha ") {
    navigator.clipboard.writeText(senhaOutput.textContent);
    alert("Senha copiada para a área de transferência!");
  }
});
