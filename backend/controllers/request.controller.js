// backend/controllers/request.controller.js (CONTINUARE)

// Importuri de bază...
const Request = require('../models/request');
const Professor = require('../models/professor'); // Trebuie să imporți modelul Profesor

// ... (exporturi.createRequest funcția de mai sus)

// Funcția 2: Aprobarea sau Respingerea unei Cereri (Doar pentru Profesor)
exports.updateRequestStatus = async (req, res) => {
    // 1. Primim ID-ul cererii din URL și decizia din body
    const { requestId } = req.params;
    const { status, justification } = req.body; 
    
    // ATENȚIE: Aici trebuie să te asiguri că profesorul care face update-ul
    // este cel autentificat (din JWT Token) și este proprietarul cererii.
    // Presupunem că avem deja profesorul autentificat (authenticatedProfessorId)
    const authenticatedProfessorId = 1; // Substituie cu ID-ul real din token

    try {
        // 2. Găsim cererea și Studentul asociat
        const request = await Request.findByPk(requestId); 

        if (!request) {
            return res.status(404).json({ message: "Cererea nu a fost găsită." });
        }
        
        // Verificare de Autorizare (Profesorul autentificat trebuie să fie cel vizat)
        if (request.professorId !== authenticatedProfessorId) {
            return res.status(403).json({ message: "Nu ești autorizat să modifici această cerere." });
        }

        // 3. Logica de Aprobare (Cea mai complexă)
        if (status === 'Approved') {
            
            // a. Verifică Locurile Disponibile
            const professor = await Professor.findByPk(authenticatedProfessorId);
            if (!professor) {
                 return res.status(404).json({ message: "Datele profesorului nu au fost găsite." });
            }

            // Număr locuri ocupate (trebuie să calculezi cererile deja aprobate)
            const approvedCount = await Request.count({
                where: { 
                    professorId: authenticatedProfessorId, 
                    status: 'Approved' 
                }
            });

            // Verifică limita (presupunem că professor.maxStudents este definit în modelul Profesor)
            if (approvedCount >= professor.maxStudents) {
                return res.status(409).json({ message: "Limita maximă de studenți a fost atinsă." });
            }

            // b. Actualizează Statusul Cererii Curente
            await request.update({ status: 'Approved', isFinalized: true });

            // c. Regula Critică: Anulează celelalte cereri ale aceluiași student!
            await Request.update({
                status: 'Rejected', // Le respingi pe celelalte
                rejectionReason: 'Student aprobat de alt profesor.',
                isFinalized: true
            }, {
                where: {
                    studentId: request.studentId, // Cererile aceluiași student
                    id: { [Op.ne]: requestId }   // Dar nu și cererea actuală!
                }
            });

        } else if (status === 'Rejected') {
            // 4. Logica de Respingere (Mai simplă)
            await request.update({ 
                status: 'Rejected', 
                rejectionReason: justification || 'Cerere respinsă.',
                isFinalized: true
            });
        } else {
            return res.status(400).json({ message: "Statusul trimis este invalid." });
        }

        // 5. Răspuns de Succes
        return res.status(200).json({ 
            message: `Cererea a fost actualizată la statusul: ${status}.`,
            request: request
        });

    } catch (error) {
        console.error('Eroare la actualizarea cererii:', error);
        return res.status(500).json({ message: 'Eroare internă a serverului.' });
    }
};