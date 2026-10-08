/* ConectaServiços — interações da landing page */
(function () {
  "use strict";

  /* ---------- 1. Demonstração: escolher serviço e ver profissionais ---------- */
  var PROFISSIONAIS = {
    eletricista: [
      { nome: "Rogério M.", nota: "4,9", aval: 127, dist: "1,2 km", preco: "R$ 90 a 150" },
      { nome: "Carla T.", nota: "4,8", aval: 86, dist: "2,0 km", preco: "R$ 100 a 160" },
      { nome: "Anderson P.", nota: "4,7", aval: 54, dist: "3,4 km", preco: "R$ 80 a 140" }
    ],
    encanador: [
      { nome: "Marcos L.", nota: "4,9", aval: 143, dist: "0,9 km", preco: "R$ 80 a 130" },
      { nome: "Josué R.", nota: "4,8", aval: 91, dist: "1,8 km", preco: "R$ 90 a 150" },
      { nome: "Elaine S.", nota: "4,6", aval: 38, dist: "2,7 km", preco: "R$ 70 a 120" }
    ],
    tecnico: [
      { nome: "Felipe C.", nota: "4,9", aval: 112, dist: "1,5 km", preco: "R$ 60 a 120" },
      { nome: "Renata A.", nota: "4,8", aval: 77, dist: "2,3 km", preco: "R$ 70 a 130" },
      { nome: "Diego F.", nota: "4,7", aval: 49, dist: "3,1 km", preco: "R$ 50 a 110" }
    ]
  };

  var ICONE_VERIFICADO =
    '<svg viewBox="0 0 24 24" role="img" aria-label="Profissional verificado">' +
    '<path d="M12 2l8 3v6c0 5-3.4 9.3-8 11-4.6-1.7-8-6-8-11V5zm-1.2 13.2l5.6-5.6-1.4-1.4-4.2 4.2-1.9-1.9-1.4 1.4z"/></svg>';

  var lista = document.getElementById("lista-pros");
  var chips = document.querySelectorAll(".chip");

  function mostrarProfissionais(tipo) {
    if (!lista || !PROFISSIONAIS[tipo]) return;
    lista.innerHTML = "";
    PROFISSIONAIS[tipo].forEach(function (p) {
      var li = document.createElement("li");
      li.className = "pro-card";
      li.innerHTML =
        '<span class="pro-card__avatar" aria-hidden="true">' + p.nome.charAt(0) + "</span>" +
        "<div>" +
          '<div class="pro-card__nome">' + p.nome + ICONE_VERIFICADO + "</div>" +
          '<div class="pro-card__meta">★ ' + p.nota + " (" + p.aval + " avaliações) · " + p.dist + "</div>" +
        "</div>" +
        '<div class="pro-card__preco">Estimativa<strong>' + p.preco + "</strong></div>";
      lista.appendChild(li);
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      chip.setAttribute("aria-pressed", "true");
      mostrarProfissionais(chip.dataset.servico);
    });
  });
  mostrarProfissionais("eletricista");

  /* ---------- 2. Captação de e-mail ---------- */
  var CHAVE = "conectaservicos_leads";
  var REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function salvarLead(lead) {
    try {
      var leads = JSON.parse(localStorage.getItem(CHAVE) || "[]");
      var jaExiste = leads.some(function (l) { return l.email === lead.email; });
      if (!jaExiste) {
        leads.push(lead);
        localStorage.setItem(CHAVE, JSON.stringify(leads));
      }
      return !jaExiste;
    } catch (e) {
      return true; // armazenamento indisponível: segue o fluxo normalmente
    }
  }

  document.querySelectorAll(".lead").forEach(function (form) {
    var input = form.querySelector('input[type="email"]');
    var campo = form.querySelector(".lead__campo");
    var erro = form.querySelector(".lead__erro");
    var ok = form.querySelector(".lead__ok");

    function limpar() {
      erro.hidden = true;
      ok.hidden = true;
      campo.classList.remove("invalido");
      input.removeAttribute("aria-invalid");
    }

    input.addEventListener("input", limpar);

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      limpar();

      var email = input.value.trim().toLowerCase();

      if (!email) {
        erro.textContent = "Digite seu e-mail para receber o aviso.";
      } else if (!REGEX_EMAIL.test(email)) {
        erro.textContent = "Esse e-mail parece incompleto. Exemplo: nome@email.com";
      }

      if (erro.textContent && !REGEX_EMAIL.test(email)) {
        erro.hidden = false;
        campo.classList.add("invalido");
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }

      var perfilEl = form.querySelector('input[name="perfil"]:checked');
      var novo = salvarLead({
        email: email,
        perfil: perfilEl ? perfilEl.value : "cliente",
        data: new Date().toISOString()
      });

      ok.textContent = novo
        ? "Pronto! Vamos avisar você em " + email + " quando o ConectaServiços estiver no ar."
        : "Esse e-mail já está na lista. Fique de olho na sua caixa de entrada.";
      ok.hidden = false;
      form.reset();
    });
  });
})();