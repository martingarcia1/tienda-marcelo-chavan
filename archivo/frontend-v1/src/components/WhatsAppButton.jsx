const WHATSAPP_NUMBER = '5493814303839'

export function whatsappHref(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
      <path d="M16.004 2.667c-7.36 0-13.333 5.973-13.333 13.333 0 2.352.615 4.56 1.692 6.475L2.667 29.333l7.03-1.845a13.27 13.27 0 0 0 6.307 1.606h.005c7.36 0 13.333-5.973 13.333-13.333S23.364 2.667 16.004 2.667Zm0 24.4h-.004a11.03 11.03 0 0 1-5.622-1.54l-.403-.24-4.172 1.095 1.114-4.068-.263-.418a11.02 11.02 0 0 1-1.7-5.896c0-6.1 4.966-11.067 11.06-11.067 2.955 0 5.732 1.152 7.822 3.244a10.99 10.99 0 0 1 3.238 7.828c0 6.1-4.966 11.062-11.07 11.062Zm6.062-8.287c-.332-.166-1.965-.97-2.27-1.08-.305-.11-.527-.166-.75.166-.222.333-.86 1.08-1.054 1.302-.194.222-.388.25-.72.083-.332-.166-1.402-.517-2.67-1.65-.987-.881-1.654-1.968-1.848-2.3-.194-.333-.02-.512.146-.678.15-.15.332-.389.5-.583.166-.194.221-.333.332-.556.11-.222.055-.416-.028-.583-.083-.166-.75-1.808-1.028-2.475-.27-.65-.545-.56-.75-.57l-.638-.012c-.222 0-.583.083-.888.416-.305.333-1.166 1.14-1.166 2.78s1.194 3.226 1.361 3.448c.166.222 2.35 3.587 5.694 5.03.796.343 1.417.548 1.902.702.799.254 1.526.218 2.101.132.641-.096 1.965-.803 2.242-1.579.277-.777.277-1.443.194-1.58-.083-.138-.305-.222-.638-.388Z" />
    </svg>
  )
}

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappHref('Hola! Quiero hacer una consulta.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center transition-transform duration-300 hover:scale-105"
      style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#25D366',
        color: '#FFFFFF',
        boxShadow: '0 8px 24px rgba(37,211,102,0.45)',
      }}
    >
      <WhatsAppIcon style={{ width: '28px', height: '28px' }} />
    </a>
  )
}
