import { footer } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-footer px-5 pb-9 pt-12 sm:px-8">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <span className="text-[15px] font-bold tracking-[0.02em] text-white">
              DANTAS GIMENEZ <span className="text-gold">&amp;</span> MACHADO
            </span>
            <div className="mt-1 text-[10px] font-medium tracking-[0.22em] text-muted">
              ADVOCACIA
            </div>
          </div>
          <div className="max-w-[480px] text-xs leading-[1.7] text-muted">
            {footer.disclaimer}
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-navy pt-5 text-xs text-muted">
          <span>{footer.copyright}</span>
          <span>{footer.team}</span>
        </div>
      </div>
    </footer>
  );
}
