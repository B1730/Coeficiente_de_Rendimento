from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calcular', methods=['POST'])
def calcular_cr():
    try:
        data = request.json
        disciplinas = data.get('disciplinas', [])
        
        if not disciplinas:
            return jsonify({'success': False, 'error': 'Nenhuma disciplina informada.'}), 400
            
        soma_produtos = 0
        soma_cargas = 0
        
        for d in disciplinas:
            nota = float(str(d.get('nota')).replace(',', '.'))
            carga = float(str(d.get('carga')).replace(',', '.'))
            
            soma_produtos += (nota * carga)
            soma_cargas += carga
            
        if soma_cargas == 0:
            return jsonify({'success': False, 'error': 'A soma das cargas horárias não pode ser zero.'}), 400
            
        cr = soma_produtos / soma_cargas
        
        return jsonify({
            'success': True,
            'cr': round(cr, 2),
            'total_pontos': round(soma_produtos, 2),
            'total_carga': round(soma_cargas, 2)
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
