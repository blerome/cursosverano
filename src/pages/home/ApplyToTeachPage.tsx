import React, { useState } from 'react';
import { usePostTeachersApplications } from '../../generated/api/teachers/teachers';
import styles from './ApplyToTeachPage.module.css';

const initialState = {
  name: '',
  paternalSurname: '',
  maternalSurname: '',
  contactEmail: '',
  contactPhone: '',
  cv: '',
  reason: '',
  countryCode: '+52',
};

const countryCodes = [
  { code: '+52', label: 'México', flag: '🇲🇽' },
  { code: '+1', label: 'EE.UU.', flag: '🇺🇸' },
  { code: '+502', label: 'Guatemala', flag: '🇬🇹' },
  { code: '+506', label: 'Costa Rica', flag: '🇨🇷' },
  { code: '+54', label: 'Argentina', flag: '🇦🇷' },
  { code: '+34', label: 'España', flag: '🇪🇸' },
];

const ApplyToTeachPage: React.FC = () => {
  const [form, setForm] = useState(initialState);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = usePostTeachersApplications({
    mutation: {
      onSuccess: () => {
        setSuccess(true);
        setForm(initialState);
        setError(null);
      },
      onError: (err: any) => {
        let msg = 'Ocurrió un error al enviar la solicitud. Intenta de nuevo.';
        if (err?.response?.data?.message) {
          if (Array.isArray(err.response.data.message)) {
            msg = err.response.data.message.join(' ');
          } else {
            msg = err.response.data.message;
          }
        }
        setError(msg);
      },
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'reason' && value.length > 200) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    // Validación básica
    if (!form.name || !form.paternalSurname || !form.contactEmail || !form.contactPhone || !form.cv) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }
    // Validar teléfono local
    const phone = form.contactPhone.replace(/\D/g, '');
    if (phone.length !== 10) {
      setError('El número de teléfono debe tener 10 dígitos.');
      return;
    }
    const fullPhone = `${form.countryCode}${phone}`;
    mutation.mutate({ params: {
      name: form.name,
      paternalSurname: form.paternalSurname,
      maternalSurname: form.maternalSurname || undefined,
      contactEmail: form.contactEmail,
      contactPhone: fullPhone,
      cv: form.cv,
      reason: form.reason || undefined,
    }});
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Solicitud para Impartir Clases</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <label>Nombre(s)*</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className={styles.fieldGroup}>
            <label>Apellido paterno*</label>
            <input name="paternalSurname" value={form.paternalSurname} onChange={handleChange} required />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <label>Apellido materno</label>
            <input name="maternalSurname" value={form.maternalSurname} onChange={handleChange} />
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <label>Teléfono de contacto*</label>
          <div className={styles.phoneRow}>
            <select
              className={styles.countryCodeSelect}
              name="countryCode"
              value={form.countryCode}
              onChange={handleChange}
            >
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
            <input
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              required
              maxLength={10}
              pattern="[0-9]{10}"
              placeholder="10 dígitos"
              style={{ flex: 1 }}
            />
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <label>Correo de contacto*</label>
          <input name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} required />
        </div>
        <div className={styles.fieldGroup}>
          <label>CV (enlace o texto)*</label>
          <input name="cv" value={form.cv} onChange={handleChange} required />
        </div>
        <div className={styles.fieldGroup}>
          <label>Motivo para impartir clases (opcional, máx. 200 caracteres)</label>
          <textarea name="reason" value={form.reason} onChange={handleChange} maxLength={200} rows={3} />
          <div className={styles.charCount}>{form.reason.length}/200</div>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>¡Solicitud enviada correctamente!</div>}
        <button className={styles.submitButton} type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </form>
    </div>
  );
};

export default ApplyToTeachPage; 