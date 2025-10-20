const inputRomano = document.getElementById('inputRomano');
const inputDecimal = document.getElementById('inputDecimal');
const erroRomano = document.getElementById('erroRomano');
const erroDecimal = document.getElementById('erroDecimal');

const valoresRomanos = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };

const correcoes = [
  { incorreto: /IIII/g, correto: 'IV' },
  { incorreto: /VIIII/g, correto: 'IX' },
  { incorreto: /XXXX/g, correto: 'XL' },
  { incorreto: /LXXXX/g, correto: 'XC' },
  { incorreto: /CCCC/g, correto: 'CD' },
  { incorreto: /DCCCC/g, correto: 'CM' },
];

function romanoParaDecimal(entrada) {
  let total = 0;
  for (let i = 0; i < entrada.length; i++) {
    const atual = valoresRomanos[entrada[i]];
    const proximo = valoresRomanos[entrada[i+1]];
    if (proximo && atual < proximo) total -= atual;
    else total += atual;
  }
  return total;
}

function decimalParaRomano(num) {
  if (num <= 0 || num >= 4000) return null;
  const tabela = [
    { valor:1000, simbolo:'M' }, { valor:900, simbolo:'CM' },
    { valor:500, simbolo:'D' }, { valor:400, simbolo:'CD' },
    { valor:100, simbolo:'C' }, { valor:90, simbolo:'XC' },
    { valor:50, simbolo:'L' }, { valor:40, simbolo:'XL' },
    { valor:10, simbolo:'X' }, { valor:9, simbolo:'IX' },
    { valor:5, simbolo:'V' }, { valor:4, simbolo:'IV' },
    { valor:1, simbolo:'I' }
  ];
  let romano = '';
  for (let i=0; i<tabela.length; i++) {
    while (num >= tabela[i].valor) {
      romano += tabela[i].simbolo;
      num -= tabela[i].valor;
    }
  }
  return romano;
}

inputRomano.addEventListener('input', () => {
  const valor = inputRomano.value.trim().toUpperCase();
  erroRomano.textContent = '';
  inputRomano.classList.remove('erro');

  if (valor === '') {
    inputDecimal.value = '';
    return;
  }

  for (let c of valor) {
    if (!valoresRomanos[c]) {
      erroRomano.textContent = `Símbolo inválido (${c})`;
      inputRomano.classList.add('erro');
      inputDecimal.value = '';
      return;
    }
  }

  for (let c of correcoes) {
    if (c.incorreto.test(valor)) {
      erroRomano.textContent = `Forma incorreta. Correto seria: ${valor.replace(c.incorreto, c.correto)}`;
      break;
    }
  }

  inputDecimal.value = romanoParaDecimal(valor);
});

inputDecimal.addEventListener('input', () => {
  const valor = parseInt(inputDecimal.value);
  erroDecimal.textContent = '';
  inputDecimal.classList.remove('erro');

  if (isNaN(valor) || valor <= 0) {
    inputRomano.value = '';
    return;
  }

  const romano = decimalParaRomano(valor);
  if (!romano) {
    erroDecimal.textContent = 'Valor fora do intervalo (1-3999)';
    inputDecimal.classList.add('erro');
    inputRomano.value = '';
    return;
  }

  inputRomano.value = romano;
});
