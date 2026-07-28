document.getElementById("data").valueAsDate = new Date();

async function gerarPDF() {

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    // ==========================
    // CARREGAR LOGO
    // ==========================
    const logo = new Image();
    logo.src = "img/logo.png";

    await new Promise((resolve, reject) => {
        logo.onload = resolve;
        logo.onerror = reject;
    });

    // ==========================
    // CABEÇALHO
    // ==========================
    pdf.addImage(logo, "PNG", 12, 10, 30, 18);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(17);

    pdf.text(
        "RELATÓRIO DE DIAGNÓSTICO TÉCNICO",
        105,
        18,
        { align: "center" }
    );

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");

    pdf.text(
        "Centro de Processamento de Dados - CPD",
        105,
        25,
        { align: "center" }
    );

    pdf.setLineWidth(0.5);
    pdf.line(10, 32, 200, 32);

    let y = 40;

    // ==========================
    // NUMERO DO LAUDO
    // ==========================

    const numero = Math.floor(Math.random() * 90000) + 10000;

    function linha(texto) {
        pdf.text(texto, 15, y);
        y += 7;
    }

    // ==========================
    // IDENTIFICAÇÃO
    // ==========================

    pdf.setFont("helvetica", "bold");
    linha("IDENTIFICAÇÃO");

    pdf.setFont("helvetica", "normal");

    linha("Laudo Nº: " + numero);
    linha("Data: " + document.getElementById("data").value);
    linha("Patrimônio: " + document.getElementById("patrimonio").value);
    linha("Secretaria: " + document.getElementById("secretaria").value);
    linha("Origem da Demanda: " + document.getElementById("origem").value);
    linha("Responsável pelo Equipamento: " + document.getElementById("responsavel").value);
    linha("Técnico Responsável: " + document.getElementById("tecnico").value);

    y += 3;

    // ==========================
    // CONFIGURAÇÃO
    // ==========================

    pdf.setFont("helvetica", "bold");
    linha("CONFIGURAÇÃO DO COMPUTADOR");

    pdf.setFont("helvetica", "normal");

    linha("Marca: " + document.getElementById("marca").value);
    linha("Modelo: " + document.getElementById("modelo").value);
    linha("Processador: " + document.getElementById("cpu").value);
    linha("Memória RAM: " + document.getElementById("ram").value);
    linha("Armazenamento: " + document.getElementById("armazenamento").value);
    linha("Sistema Operacional: " + document.getElementById("so").value);

    y += 3;

    // ==========================
    // PROBLEMA
    // ==========================

    pdf.setFont("helvetica", "bold");
    linha("PROBLEMA RELATADO");

    pdf.setFont("helvetica", "normal");

    let texto = pdf.splitTextToSize(
        document.getElementById("problema").value,
        180
    );

    pdf.text(texto, 15, y);

    y += texto.length * 6 + 5;

    // ==========================
    // DIAGNÓSTICO
    // ==========================

    pdf.setFont("helvetica", "bold");
    linha("DIAGNÓSTICO TÉCNICO");

    pdf.setFont("helvetica", "normal");

    texto = pdf.splitTextToSize(
        document.getElementById("diagnostico").value,
        180
    );

    pdf.text(texto, 15, y);

    y += texto.length * 6 + 5;

    // ==========================
    // PROCEDIMENTOS
    // ==========================

    pdf.setFont("helvetica", "bold");
    linha("PROCEDIMENTOS REALIZADOS");

    pdf.setFont("helvetica", "normal");

    texto = pdf.splitTextToSize(
        document.getElementById("procedimentos").value,
        180
    );

    pdf.text(texto, 15, y);

    y += texto.length * 6 + 5;

    // ==========================
    // COMPONENTES
    // ==========================

    pdf.setFont("helvetica", "bold");
    linha("COMPONENTES REUTILIZÁVEIS");

    pdf.setFont("helvetica", "normal");

    let pecas = [];

    document.querySelectorAll(".checkboxes input:checked").forEach(item => {
        pecas.push(item.value);
    });

    if (pecas.length === 0) {

        linha("Nenhum componente reutilizável.");

    } else {

        texto = pdf.splitTextToSize(pecas.join(", "), 180);

        pdf.text(texto, 15, y);

        y += texto.length * 6;
    }

    y += 5;

    // ==========================
    // STATUS
    // ==========================

    pdf.setFont("helvetica", "bold");

    linha("STATUS DO EQUIPAMENTO");

    pdf.setFont("helvetica", "normal");

    linha(document.getElementById("status").value);

    y += 3;

    // ==========================
    // OBSERVAÇÕES
    // ==========================

    pdf.setFont("helvetica", "bold");

    linha("OBSERVAÇÕES");

    pdf.setFont("helvetica", "normal");

    texto = pdf.splitTextToSize(
        document.getElementById("observacoes").value,
        180
    );

    pdf.text(texto, 15, y);

    // ==========================
    // RODAPÉ
    // ==========================

    pdf.setDrawColor(180);

    pdf.line(10, 285, 200, 285);

    pdf.setFontSize(9);

    pdf.text(
        "Documento gerado automaticamente pelo Sistema de Diagnóstico do CPD.",
        105,
        290,
        { align: "center" }
    );

    pdf.save(`Relatorio_${numero}.pdf`);
}