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
        <li><strong>E-mail do cliente:</strong> ${proposta.emailCliente || "N/A"}</li>
        <li><strong>Telefone do cliente:</strong> ${proposta.telefoneCliente || "N/A"}</li>
        <li><strong>Lote:</strong> ${lote.id}</li>
        <li><strong>Quadra:</strong> ${lote.q}</li>
        <li><strong>Número:</strong> ${lote.n}</li>
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
        <li><strong>Lote:</strong> ${lote.id}</li>
        <li><strong>Quadra:</strong> ${lote.q}</li>
        <li><strong>Número:</strong> ${lote.n}</li>
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

// ==========================================
// NOTIFICAÇÕES PARA CORRETORES
// ==========================================

export const notifyBrokerAccessApproved = (user) => {
  const subject = `[Gestão VEL] Acesso aprovado`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #16a34a;">Olá, ${user.nome}!</h2>
      <p>O seu acesso ao sistema Gestão VEL foi <strong>aprovado</strong>.</p>
      <p>Você já pode acessar a plataforma utilizando o seu login/e-mail e a senha cadastrada.</p>
      <p style="margin-top: 20px;">
        <a href="${appUrl}/" style="background: #16a34a; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Acessar o Sistema</a>
      </p>
    </div>
  `;
  sendMailSafe({ subject, html, to: user.login }).catch(() => {});
};

export const notifyBrokerAccessRejected = (user) => {
  const subject = `[Gestão VEL] Solicitação de acesso analisada`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #475569;">Olá, ${user.nome}.</h2>
      <p>Sua solicitação de acesso ao sistema Gestão VEL foi analisada, mas <strong>não foi aprovada</strong> neste momento.</p>
      <p>Caso tenha alguma dúvida ou acredite ser um engano, por favor, entre em contato diretamente com a gestão.</p>
    </div>
  `;
  sendMailSafe({ subject, html, to: user.login }).catch(() => {});
};

export const notifyBrokerReservation = (lote, user, venceEm) => {
  const subject = `[Gestão VEL] Reserva criada - Lote ${lote.id}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #d97706;">Reserva Confirmada</h2>
      <p>Você reservou com sucesso um lote no sistema.</p>
      <ul style="background: #fffbeb; padding: 15px 30px; border-radius: 8px;">
        <li><strong>Lote:</strong> ${lote.id}</li>
        <li><strong>Quadra:</strong> ${lote.q}</li>
        <li><strong>Número:</strong> ${lote.n}</li>
        <li><strong>Válida até:</strong> ${new Date(venceEm).toLocaleString('pt-BR')}</li>
      </ul>
      <p style="margin-top: 20px;">
        <a href="${appUrl}/" style="background: #d97706; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Acessar o Sistema</a>
      </p>
    </div>
  `;
  sendMailSafe({ subject, html, to: user.login }).catch(() => {});
};

export const notifyBrokerProposal = (proposta, lote, user) => {
  const subject = `[Gestão VEL] Proposta enviada - Lote ${lote.id}`;
  let detailsFin = "";
  try {
    const fin = typeof proposta.payloadFinanceiro === "string" ? JSON.parse(proposta.payloadFinanceiro) : proposta.payloadFinanceiro;
    detailsFin = `<li><strong>Valor Estimado:</strong> R$ ${fin.totalEstimado?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</li>`;
  } catch(e) {}

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #1e3a8a;">Proposta Enviada com Sucesso</h2>
      <p>Sua proposta foi enviada para a análise da gestão.</p>
      <ul style="background: #f8fafc; padding: 15px 30px; border-radius: 8px;">
        <li><strong>Cliente:</strong> ${proposta.nomeCliente}</li>
        <li><strong>Lote:</strong> ${lote.id}</li>
        <li><strong>Quadra:</strong> ${lote.q}</li>
        <li><strong>Número:</strong> ${lote.n}</li>
        ${detailsFin}
        <li><strong>Status:</strong> <span style="color: #ca8a04; font-weight: bold;">Pendente</span></li>
      </ul>
      <p style="margin-top: 20px;">
        <a href="${appUrl}/" style="background: #2563eb; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Acompanhar no Sistema</a>
      </p>
    </div>
  `;
  sendMailSafe({ subject, html, to: user.login }).catch(() => {});
};

export const notifyBrokerProposalApproved = (proposta, corretor, lote) => {
  const subject = `[Gestão VEL] Proposta aprovada - Lote ${lote.id}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #16a34a;">Boas notícias, ${corretor.nome}!</h2>
      <p>Sua proposta para o cliente <strong>${proposta.nomeCliente}</strong> foi <strong>APROVADA</strong> pela gestão!</p>
      <ul style="background: #f0fdf4; padding: 15px 30px; border-radius: 8px;">
        <li><strong>Lote:</strong> ${lote.id}</li>
        <li><strong>Quadra:</strong> ${lote.q}</li>
        <li><strong>Número:</strong> ${lote.n}</li>
      </ul>
      <p>Acesse o sistema para consultar os próximos passos ou entre em contato com a gestão para o fechamento do contrato.</p>
      <p style="margin-top: 20px;">
        <a href="${appUrl}/" style="background: #16a34a; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Acessar o Sistema</a>
      </p>
    </div>
  `;
  sendMailSafe({ subject, html, to: corretor.login }).catch(() => {});
};

export const notifyBrokerProposalRejected = (proposta, corretor, lote) => {
  const subject = `[Gestão VEL] Proposta recusada - Lote ${lote.id}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #dc2626;">Olá, ${corretor.nome}.</h2>
      <p>Sua proposta para o cliente <strong>${proposta.nomeCliente}</strong> foi <strong>RECUSADA</strong> pela gestão.</p>
      <ul style="background: #fef2f2; padding: 15px 30px; border-radius: 8px;">
        <li><strong>Lote:</strong> ${lote.id}</li>
        <li><strong>Quadra:</strong> ${lote.q}</li>
        <li><strong>Número:</strong> ${lote.n}</li>
      </ul>
      <p>Por favor, consulte a gestão caso precise ajustar os valores ou as condições de pagamento e tentar novamente.</p>
      <p style="margin-top: 20px;">
        <a href="${appUrl}/" style="background: #dc2626; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Acessar o Sistema</a>
      </p>
    </div>
  `;
  sendMailSafe({ subject, html, to: corretor.login }).catch(() => {});
};

export const notifyBrokerReservationReleased = (lote, corretor) => {
  const subject = `[Gestão VEL] Reserva liberada - Lote ${lote.id}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #475569;">Reserva Liberada ou Cancelada</h2>
      <p>Olá, ${corretor.nome}. A sua reserva para o lote abaixo foi liberada/cancelada e o lote encontra-se disponível novamente no sistema.</p>
      <ul style="background: #f8fafc; padding: 15px 30px; border-radius: 8px;">
        <li><strong>Lote:</strong> ${lote.id}</li>
        <li><strong>Quadra:</strong> ${lote.q}</li>
        <li><strong>Número:</strong> ${lote.n}</li>
      </ul>
      <p style="margin-top: 20px;">
        <a href="${appUrl}/" style="background: #475569; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Acessar o Sistema</a>
      </p>
    </div>
  `;
  sendMailSafe({ subject, html, to: corretor.login }).catch(() => {});
};
