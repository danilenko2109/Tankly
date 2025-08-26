
import './BalanceModal.scss';

const BalanceModal = ({ isOpen, onClose, }) => {
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content balance-modal">
        <div className="modal-header">
          <h2>Технические работы(1час)</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        
            <label>В данный момент невозможно пополнить баланс</label>
            
            
            

          


          
      </div>
    </div>
  );
};

export default BalanceModal;  