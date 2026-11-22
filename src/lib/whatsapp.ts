/**
 * Générateur de messages WhatsApp pour patients marocains
 */

export function cleanPhoneForWhatsApp(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  // Format marocain local "06..." ou "07..." -> "2126..." / "2127..."
  if (cleaned.startsWith('0')) {
    cleaned = '212' + cleaned.substring(1);
  }
  return cleaned;
}

export function buildAppointmentReminderUrl(params: {
  patientPhone: string;
  patientName: string;
  doctorName: string;
  clinicName: string;
  clinicAddress: string;
  appointmentDate: string; // "mardi 24 novembre"
  appointmentTime: string; // "10:30"
}): string {
  const phone = cleanPhoneForWhatsApp(params.patientPhone);
  const text = encodeURIComponent(
    `Bonjour M/Mme ${params.patientName},\n\n` +
      `Ceci est un rappel de votre rendez-vous au *${params.clinicName}* (Dr. ${params.doctorName}) :\n` +
      `📅 *Date :* ${params.appointmentDate}\n` +
      `⏰ *Heure :* ${params.appointmentTime}\n` +
      `📍 *Adresse :* ${params.clinicAddress}\n\n` +
      `Merci de nous confirmer votre présence ou de nous signaler tout empêchement au moins 24h à l'avance.\n\n` +
      `À très bientôt ! 🦷`
  );
  return `https://wa.me/${phone}?text=${text}`;
}

export function buildGoogleReviewRequestUrl(params: {
  patientPhone: string;
  patientName: string;
  clinicName: string;
  googleReviewUrl: string;
}): string {
  const phone = cleanPhoneForWhatsApp(params.patientPhone);
  const text = encodeURIComponent(
    `Bonjour ${params.patientName},\n\n` +
      `Toute l'équipe du *${params.clinicName}* espère que vos soins se sont bien passés et que vous vous portez à merveille ! ✨\n\n` +
      `Votre avis compte énormément pour nous. Pourriez-vous nous accorder 30 secondes pour partager votre expérience avec une note de 5 étoiles sur Google ? ⭐⭐⭐⭐⭐\n\n` +
      `👉 Cliquez ici : ${params.googleReviewUrl}\n\n` +
      `Un grand merci pour votre confiance et à bientôt ! 🦷`
  );
  return `https://wa.me/${phone}?text=${text}`;
}

export function buildDirectWhatsAppUrl(phone: string, message = ''): string {
  const cleaned = cleanPhoneForWhatsApp(phone);
  return `https://wa.me/${cleaned}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}
