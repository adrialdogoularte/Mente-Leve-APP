// Utilitário para gerenciar notificações de lembretes
class NotificationManager {
  constructor() {
    this.scheduledNotifications = new Map();
  }

  // Solicita permissão para exibir notificações
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('Permissão para notificações foi negada');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão para notificações:', error);
      return false;
    }
  }

  // Verifica se as notificações estão disponíveis e permitidas
  isNotificationSupported() {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  // Exibe uma notificação imediata
  showNotification(title, options = {}) {
    if (!this.isNotificationSupported()) {
      console.warn('Notificações não estão disponíveis ou não foram permitidas');
      return null;
    }

    const defaultOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'mente-leve-reminder',
      requireInteraction: true,
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);
      
      // Auto-fechar após 5 segundos se não for interativa
      if (!defaultOptions.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      return notification;
    } catch (error) {
      console.error('Erro ao exibir notificação:', error);
      return null;
    }
  }

  // Agenda uma notificação para um horário específico
  scheduleNotification(id, title, body, scheduledTime, options = {}) {
    const now = new Date().getTime();
    const delay = scheduledTime.getTime() - now;

    if (delay <= 0) {
      console.warn('Horário agendado já passou');
      return false;
    }

    // Cancela notificação anterior com o mesmo ID se existir
    this.cancelScheduledNotification(id);

    const timeoutId = setTimeout(() => {
      this.showNotification(title, {
        body,
        ...options
      });
      
      // Remove da lista de agendadas após exibir
      this.scheduledNotifications.delete(id);
    }, delay);

    // Armazena o timeout para poder cancelar depois
    this.scheduledNotifications.set(id, {
      timeoutId,
      title,
      body,
      scheduledTime,
      options
    });

    console.log(`Notificação agendada para ${scheduledTime.toLocaleString()}`);
    return true;
  }

  // Cancela uma notificação agendada
  cancelScheduledNotification(id) {
    const scheduled = this.scheduledNotifications.get(id);
    if (scheduled) {
      clearTimeout(scheduled.timeoutId);
      this.scheduledNotifications.delete(id);
      console.log(`Notificação ${id} cancelada`);
      return true;
    }
    return false;
  }

  // Lista todas as notificações agendadas
  getScheduledNotifications() {
    const notifications = [];
    this.scheduledNotifications.forEach((notification, id) => {
      notifications.push({
        id,
        ...notification
      });
    });
    return notifications;
  }

  // Cancela todas as notificações agendadas
  cancelAllScheduledNotifications() {
    this.scheduledNotifications.forEach((notification, id) => {
      clearTimeout(notification.timeoutId);
    });
    this.scheduledNotifications.clear();
    console.log('Todas as notificações agendadas foram canceladas');
  }

  // Agenda lembretes baseado nos dados do backend
  scheduleReminders(lembretes) {
    if (!Array.isArray(lembretes)) {
      console.warn('Lembretes deve ser um array');
      return;
    }

    lembretes.forEach(lembrete => {
      if (!lembrete.ativo) return;

      const now = new Date();
      const [hours, minutes] = lembrete.horario.split(':');
      
      // Agenda para hoje se ainda não passou do horário
      const today = new Date();
      today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      if (today > now) {
        this.scheduleNotification(
          `lembrete-${lembrete.id}-today`,
          '🧠 Mente Leve - Lembrete',
          lembrete.mensagem,
          today,
          {
            icon: '/favicon.ico',
            tag: 'mente-leve-reminder'
          }
        );
      }

      // Agenda para amanhã
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      this.scheduleNotification(
        `lembrete-${lembrete.id}-tomorrow`,
        '🧠 Mente Leve - Lembrete',
        lembrete.mensagem,
        tomorrow,
        {
          icon: '/favicon.ico',
          tag: 'mente-leve-reminder'
        }
      );
    });
  }
}

// Instância singleton
const notificationManager = new NotificationManager();

export default notificationManager;

