let rowCount = 1;

// Função para criar uma nova linha (usada tanto pelo botão "Nova" quanto pelo "Duplicar")
function createRow(notaValue = '', cargaValue = '') {
    rowCount++;
    const container = document.getElementById('disciplinas-container');
    const newRow = document.createElement('div');
    newRow.className = 'disciplina-row';
    newRow.id = `row-${rowCount}`;
    newRow.innerHTML = `
        <div class="input-group">
            <label>Nota (Mᵢ)</label>
            <input type="number" step="0.01" class="nota" placeholder="Ex: 9.0" value="${notaValue}" required>
        </div>
        <div class="input-group">
            <label>Carga/Créditos (Cᵢ)</label>
            <input type="number" step="1" class="carga" placeholder="Ex: 70" value="${cargaValue}" required>
        </div>
        <div class="row-actions">
            <button type="button" class="btn-duplicate" onclick="duplicateRow(${rowCount})" title="Duplicar Linha">❐</button>
            <button type="button" class="btn-remove" onclick="removeRow(${rowCount})" title="Remover">×</button>
        </div>
    `;
    container.appendChild(newRow);
}

// Botão "Nova Disciplina" (vazia)
document.getElementById('btn-add').addEventListener('click', () => {
    createRow();
});

// Função para duplicar uma linha específica
function duplicateRow(id) {
    const row = document.getElementById(`row-${id}`);
    const nota = row.querySelector('.nota').value;
    const carga = row.querySelector('.carga').value;
    createRow(nota, carga);
}

function removeRow(id) {
    const rows = document.querySelectorAll('.disciplina-row');
    if (rows.length > 1) {
        document.getElementById(`row-${id}`).remove();
    } else {
        alert("Você precisa de pelo menos uma disciplina.");
    }
}

document.getElementById('btn-calcular').addEventListener('click', async () => {
    const rows = document.querySelectorAll('.disciplina-row');
    const disciplinas = [];
    let valid = true;

    rows.forEach(row => {
        const nota = row.querySelector('.nota').value;
        const carga = row.querySelector('.carga').value;

        if (!nota || !carga) {
            valid = false;
            row.classList.add('error'); // Podemos adicionar uma classe de erro visual
        } else {
            row.classList.remove('error');
            disciplinas.push({
                nota: nota,
                carga: carga
            });
        }
    });

    if (!valid) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    try {
        const response = await fetch('/calcular', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ disciplinas })
        });

        const result = await response.json();

        if (result.success) {
            document.getElementById('res-cr').innerText = result.cr.toFixed(2);
            document.getElementById('res-pontos').innerText = result.total_pontos.toFixed(2);
            document.getElementById('res-carga').innerText = result.total_carga;
            document.getElementById('resultado-card').classList.remove('hidden');
            
            document.getElementById('resultado-card').scrollIntoView({ behavior: 'smooth' });
        } else {
            alert("Erro: " + result.error);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao conectar com o servidor.");
    }
});
