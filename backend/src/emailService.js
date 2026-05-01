import nodemailer from "nodemailer";
import 'dotenv/config';

// Cria um transporter que só logará erro se falhar (não quebra a aplicação)
let transporter = null;

try {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT == 465, // true para 465, false para outras portas
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log("✅ Serviço de e-mail configurado.");
  } else {
    console.warn("⚠️ SMTP não configurado no .env. Notificações por e-mail desativadas.");
  }
} catch (e) {
  console.error("❌ Falha ao iniciar transporter de e-mail:", e.message);
}

const sendMailSafe = async (mailOptions) => {
  if (!transporter) {
    console.log("🛑 Tentativa de envio de e-mail ignorada (SMTP ausente).", mailOptions.subject);
    return;
  }
  
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Gestão VEL" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_ADMIN_EMAIL,
      ...mailOptions
    });
    console.log(`📧 E-mail enviado: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Erro ao enviar e-mail (${mailOptions.subject}):`, error.message);
  }
};

const appUrl = process.env.APP_PUBLIC_URL || "http://localhost:3000";

export const notifyNewAccessRequest = (user) => {
  const subject = `[Gestão VEL] Nova solicitação de acesso: ${user.nome}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #1e3a8a;">Nova Solicitação de Acesso</h2>
      <p>Uma nova solicitação foi registrada no sistema e aguarda aprovação.</p>
      <ul style="background: #f8fafc; padding: 15px 30px; border-radius: 8px;">
        <li><strong>Nome:</strong> ${user.nome}</li>
        <li><strong>E-mail/Login:</strong> ${user.login}</li>
        <li><strong>Telefone:</strong> ${user.telefone || "Não informado"}</li>
        <li><strong>Imobiliária:</strong> ${user.imobiliaria || "Não informada"}</li>
        <li><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</li>
      </ul>
      <p style="margin-top: 20px;">
        <a href="${appUrl}/" style="background: #2563eb; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Acessar Painel de Usuários</a>
      </p>
    </div>
  `;
  // Fire and forget
  sendMailSafe({ subject, html }).catch(() => {});
};

export const notifyNewProposal = (proposta, lote, user) => {
  const subject = `[Gestão VEL] Nova proposta enviada - Lote ${lote.id}`;
  let detailsFin = "";
  try {
    const fin = typeof proposta.payloadFinanceiro === "string" ? JSON.parse(proposta.payloadFinanceiro) : proposta.payloadFinanceiro;
    detailsFin = `
      <li><strong>Total Estimado:</strong> R$ ${fin.totalEstimado?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</li>
      <li><strong>Entrada:</strong> R$ ${fin.financiamento?.entradaProposta?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</li>
      <li><strong>Método:</strong> ${fin.financiamento?.metodo || "N/A"} (${fin.fluxoMensal?.quantidadeParcelas || 0}x)</li>
    `;
  } catch(e) {}

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #16a34a;">Nova Proposta Recebida</h2>
      <p>O corretor <strong>${user.nome}</strong> enviou uma nova proposta.</p>
      <ul style="background: #f0fdf4; padding: 15px 30px; border-radius: 8px;">
        <li><strong>Corretor:</strong> ${user.nome} (${user.login})</li>
        <li><strong>Cliente:</strong> ${proposta.nomeCliente}</li>
        <li><strong>Contato:</strong> ${proposta.telefoneCliente || "N/A"} / ${proposta.emailCliente || "N/A"}</li>
        <li><strong>Lote/Quadra:</strong> Lote ${lote.n} | Quadra ${lote.q} (${lote.id})</li>
        <li><strong>Valor Tabela:</strong> R$ ${lote.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</li>
        ${detailsFin}
        <li><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</li>
      </ul>
      <p style="margin-top: 20px;">
        <a href="${appUrl}/" style="background: #16a34a; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Acessar Propostas</a>
      </p>
    </div>
  `;
  sendMailSafe({ subject, html }).catch(() => {});
};

export const notifyNewReservation = (lote, user, venceEm) => {
  const subject = `[Gestão VEL] Nova reserva criada - Lote ${lote.id}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #d97706;">Nova Reserva Criada</h2>
      <p>Um lote foi reservado no sistema.</p>
      <ul style="background: #fffbeb; padding: 15px 30px; border-radius: 8px;">
        <li><strong>Corretor:</strong> ${user.nome} (${user.login})</li>
        <li><strong>Lote/Quadra:</strong> Lote ${lote.n} | Quadra ${lote.q} (${lote.id})</li>
        <li><strong>Reserva em:</strong> ${new Date().toLocaleString('pt-BR')}</li>
        <li><strong>Válida até:</strong> ${new Date(venceEm).toLocaleString('pt-BR')}</li>
      </ul>
      <p style="margin-top: 20px;">
        <a href="${appUrl}/" style="background: #d97706; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Acessar Painel</a>
      </p>
    </div>
  `;
  sendMailSafe({ subject, html }).catch(() => {});
};
