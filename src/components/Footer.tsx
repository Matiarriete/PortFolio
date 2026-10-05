import { useI18n } from '../i18n/context'
import { profile } from '../data/content'
import { Icon } from './Icon'
import './Footer.css'

export function Footer() {
  const { dictionary } = useI18n()
  const { footer } = dictionary
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__meta">
            <p className="footer__copyright">
              © {year} {profile.name}. {footer.rights}
            </p>
            <p className="footer__note">{footer.builtWith}</p>
          </div>

          <div className="footer__actions">
            <a className="btn btn--ghost" href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="download" size={17} className="btn__icon" />
              CV
            </a>
            <a className="btn btn--outline" href="#inicio">
              <Icon name="arrow-up" size={17} className="btn__icon" />
              {footer.backToTop}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}