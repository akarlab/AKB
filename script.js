// Pričekamo da se DOM potpuno učita
document.addEventListener('DOMContentLoaded', () => {

    // 1. Otkrivanje elemenata prilikom skrolanja (Scroll Animations)
    const revealElements = document.querySelectorAll('.reveal');
    const loadElements = document.querySelectorAll('.reveal-on-load');

    // Odmah aktiviramo elemente koji se trebaju pokazati kad otvorimo stranicu
    setTimeout(() => {
        loadElements.forEach(el => {
            el.classList.add('active');
        });
    }, 100); // Kratka odgoda za bolji vizual

    // Intersection Observer za elemente koji ulaze u vidno polje (Scrolanje)
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Ako želimo da animacija ostane trajno, možemo prekinuti praćenje elementa
                // observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Pokaži element kad je barem 15% vidljiv
        rootMargin: "0px 0px -50px 0px" // Pokreće animaciju mali trenutak pre ulaska
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // 2. Promjena stila navigacije na scroll (Navbar Shrink/Shadow)
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // 3. Mobilni izbornik (Hamburger)
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileNav.classList.toggle('active');
            // Sprečavanje scrollanja pozadine kad je otvoren meni
            if (mobileNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Zatvori mobilni izbornik na klik linka
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // 4. Smooth scrolling za anchor linkove (klik na logo ili ostale linkove)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '' || this.classList.contains('open-contact-modal')) return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Uzima u obzir visinu navigacije
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 5. Contact Modal Logic
    const modal = document.getElementById('contact-modal');
    const openModalBtns = document.querySelectorAll('.open-contact-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const contactForm = document.getElementById('contact-form');

    // Otvaranje modala
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Spriječi skrolanje pozadine
        });
    });

    // Zatvaranje na X
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Zatvaranje na klik izvan modala
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Form Submission (Web3Forms API)
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Slanje...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            
            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    // Uspješno poslano
                    submitBtn.innerText = 'Uspješno poslano! ✔️';
                    submitBtn.style.backgroundColor = '#48bb78'; // Zelena boja
                    
                    setTimeout(() => {
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                        contactForm.reset();
                        submitBtn.innerText = originalText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    console.log(response);
                    submitBtn.innerText = 'Greška pri slanju ❌';
                    setTimeout(() => {
                        submitBtn.innerText = originalText;
                        submitBtn.disabled = false;
                    }, 3000);
                }
            })
            .catch(error => {
                console.log(error);
                submitBtn.innerText = 'Dogodila se greška ❌';
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }

    // 6. Multi-Language Support
    const translations = {
        hr: {
            nav_about: "O nama",
            nav_services: "Usluge",
            nav_gallery: "Galerija",
            nav_why: "Zašto mi",
            nav_contact: "Kontakt",
            hero_title: "Imate osjećaj da ste zapeli u valovima?",
            hero_subtitle: "Potražite nas i rado ćemo stvoriti bonacu u Vašem poslovanju.",
            about_title: "O nama",
            about_desc: "<strong>AKB CREATIVE HOUSE</strong> je kreativna digitalna agencija inspirirana Jadranom, a nastala je s ciljem da malim i srednjim poduzetnicima te jahtaškim brendovima pruži jasan smjer, snažan vizual i stabilan rast.",
            about_mission_title: "Naša misija",
            about_mission_desc: "Pomažemo malim i srednjim poduzećima, posebno u turizmu i ugostiteljstvu, da izgrade snažnu online prisutnost kroz izradu modernih web stranica i vođenje društvenih mreža.",
            about_vision_title: "Naša vizija",
            about_vision_desc: "Postati pouzdan partner poduzetnicima u Hrvatskoj i šire koji žele jednostavno i učinkovito unaprijediti svoje digitalno poslovanje.",
            services_title: "Što radimo?",
            srv_social: "Vođenje i izrada<br>društvenih mreža",
            srv_email: "E-mail marketing<br>kampanje",
            srv_photo: "Profesionalno fotografiranje<br>i video",
            srv_web: "Izrada modernih<br>web stranica",
            srv_events: "Organizacija i promocija<br>evenata",
            target_title: "S kime radimo?",
            target_1: "malim i srednjim poduzetnicima",
            target_2: "turističkim i lifestyle brandovima",
            target_3: "jahtaškim i nautičkim biznisima na Jadranu",
            gallery_title: "Naši radovi",
            banner_title: "Vaš brend na pravoj je ruti!",
            why_title: "Zašto odabrati AKB creative house?",
            why_1_title: "Osobni pristup",
            why_1_desc: "Radite direktno sa mnom.",
            why_2_title: "Jasna strategija",
            why_2_desc: "Bez lutanja do cilja.",
            why_3_title: "Premium vizual",
            why_3_desc: "Estetika koja pouzdano prodaje.",
            why_4_title: "Fleksibilnost",
            why_4_desc: "Prilagodba Vašem tempu i sezoni, ali javite se na vrijeme!",
            footer_desc: "Pružamo jasan smjer, snažan vizual i stabilan rast.",
            footer_contact_title: "Kontaktirajte nas",
            footer_rights: "Sva prava pridržana.",
            modal_title: "Pošalji upit",
            modal_name: "Vaše ime:",
            modal_name_ph: "npr. Ivan Horvat",
            modal_contact: "Vaš Email ili broj telefona:",
            modal_contact_ph: "npr. ivan@email.com ili 091...",
            modal_type: "Tip upita:",
            modal_reg: "Regularno",
            modal_urg: "Hitno!",
            modal_msg: "Vaša poruka / opis projekta:",
            modal_msg_ph: "Opišite nam kako vam možemo pomoći...",
            modal_submit: "Pošalji upit"
        },
        en: {
            nav_about: "About Us",
            nav_services: "Services",
            nav_gallery: "Gallery",
            nav_why: "Why Us",
            nav_contact: "Contact",
            hero_title: "Feeling stuck in the waves?",
            hero_subtitle: "Reach out to us and we'll gladly create smooth sailing for your business.",
            about_title: "About Us",
            about_desc: "<strong>AKB CREATIVE HOUSE</strong> is a creative digital agency inspired by the Adriatic, created with the goal of providing SMEs and yachting brands with a clear direction, strong visuals, and stable growth.",
            about_mission_title: "Our Mission",
            about_mission_desc: "We help small and medium enterprises, especially in tourism and hospitality, build a strong online presence through modern website development and social media management.",
            about_vision_title: "Our Vision",
            about_vision_desc: "To become a reliable partner for entrepreneurs in Croatia and beyond who want to simply and effectively improve their digital business.",
            services_title: "What We Do",
            srv_social: "Social Media<br>Management & Creation",
            srv_email: "E-mail Marketing<br>Campaigns",
            srv_photo: "Professional Photography<br>& Video",
            srv_web: "Modern Website<br>Development",
            srv_events: "Event Organization<br>& Promotion",
            target_title: "Who Do We Work With?",
            target_1: "small and medium businesses",
            target_2: "tourism and lifestyle brands",
            target_3: "yachting and nautical businesses on the Adriatic",
            gallery_title: "Our Work",
            banner_title: "Your brand is on the right route!",
            why_title: "Why choose AKB creative house?",
            why_1_title: "Personal Approach",
            why_1_desc: "You work directly with me.",
            why_2_title: "Clear Strategy",
            why_2_desc: "No wandering towards the goal.",
            why_3_title: "Premium Visuals",
            why_3_desc: "Aesthetics that reliably sell.",
            why_4_title: "Flexibility",
            why_4_desc: "Adapting to your pace and season, but reach out on time!",
            footer_desc: "We provide a clear direction, strong visuals, and stable growth.",
            footer_contact_title: "Contact Us",
            footer_rights: "All rights reserved.",
            modal_title: "Send an Inquiry",
            modal_name: "Your Name:",
            modal_name_ph: "e.g. John Doe",
            modal_contact: "Your Email or Phone:",
            modal_contact_ph: "e.g. john@email.com or +385...",
            modal_type: "Inquiry Type:",
            modal_reg: "Regular",
            modal_urg: "Urgent!",
            modal_msg: "Your message / project description:",
            modal_msg_ph: "Describe how we can help you...",
            modal_submit: "Send Inquiry"
        },
        es: {
            nav_about: "Sobre nosotros",
            nav_services: "Servicios",
            nav_gallery: "Galería",
            nav_why: "Por qué nosotros",
            nav_contact: "Contacto",
            hero_title: "¿Sientes que te has atascado en las olas?",
            hero_subtitle: "Contáctanos y con gusto crearemos aguas tranquilas para tu negocio.",
            about_title: "Sobre nosotros",
            about_desc: "<strong>AKB CREATIVE HOUSE</strong> es una agencia digital creativa inspirada en el Adriático, creada con el objetivo de proporcionar a las PYMEs y a las marcas de yates una dirección clara, visuales fuertes y un crecimiento estable.",
            about_mission_title: "Nuestra Misión",
            about_mission_desc: "Ayudamos a las pequeñas y medianas empresas, especialmente en turismo y hostelería, a construir una fuerte presencia en línea a través del desarrollo de sitios web modernos y la gestión de redes sociales.",
            about_vision_title: "Nuestra Visión",
            about_vision_desc: "Convertirnos en un socio confiable para emprendedores en Croacia y más allá que deseen mejorar su negocio digital de manera simple y efectiva.",
            services_title: "Lo Que Hacemos",
            srv_social: "Gestión y Creación de<br>Redes Sociales",
            srv_email: "Campañas de<br>E-mail Marketing",
            srv_photo: "Fotografía Profesional<br>y Video",
            srv_web: "Desarrollo de<br>Sitios Web Modernos",
            srv_events: "Organización y Promoción<br>de Eventos",
            target_title: "¿Con Quién Trabajamos?",
            target_1: "pequeñas y medianas empresas",
            target_2: "marcas de turismo y estilo de vida",
            target_3: "negocios náuticos y de yates en el Adriático",
            gallery_title: "Nuestro Trabajo",
            banner_title: "¡Tu marca está en la ruta correcta!",
            why_title: "¿Por qué elegir AKB creative house?",
            why_1_title: "Enfoque Personal",
            why_1_desc: "Trabajas directamente conmigo.",
            why_2_title: "Estrategia Clara",
            why_2_desc: "Sin divagar hacia la meta.",
            why_3_title: "Visual Premium",
            why_3_desc: "Estética que vende de forma fiable.",
            why_4_title: "Flexibilidad",
            why_4_desc: "Nos adaptamos a tu ritmo y temporada, ¡pero contáctanos a tiempo!",
            footer_desc: "Proporcionamos una dirección clara, visuales fuertes y un crecimiento estable.",
            footer_contact_title: "Contáctanos",
            footer_rights: "Todos los derechos reservados.",
            modal_title: "Enviar una Consulta",
            modal_name: "Tu Nombre:",
            modal_name_ph: "p. ej. Juan Pérez",
            modal_contact: "Tu Correo o Teléfono:",
            modal_contact_ph: "p. ej. juan@email.com o +34...",
            modal_type: "Tipo de Consulta:",
            modal_reg: "Regular",
            modal_urg: "¡Urgente!",
            modal_msg: "Tu mensaje / descripción del proyecto:",
            modal_msg_ph: "Describe cómo podemos ayudarte...",
            modal_submit: "Enviar Consulta"
        },
        it: {
            nav_about: "Chi siamo",
            nav_services: "Servizi",
            nav_gallery: "Galleria",
            nav_why: "Perché noi",
            nav_contact: "Contatti",
            hero_title: "Ti senti bloccato tra le onde?",
            hero_subtitle: "Contattaci e saremo felici di creare mare calmo per il tuo business.",
            about_title: "Chi siamo",
            about_desc: "<strong>AKB CREATIVE HOUSE</strong> è un'agenzia digitale creativa ispirata all'Adriatico, nata con l'obiettivo di fornire alle PMI e ai marchi del settore nautico una direzione chiara, forti elementi visivi e una crescita stabile.",
            about_mission_title: "La Nostra Missione",
            about_mission_desc: "Aiutiamo le piccole e medie imprese, specialmente nel turismo e nell'ospitalità, a costruire una forte presenza online attraverso lo sviluppo di siti web moderni e la gestione dei social media.",
            about_vision_title: "La Nostra Visione",
            about_vision_desc: "Diventare un partner affidabile per gli imprenditori in Croazia e oltre, che vogliono migliorare il loro business digitale in modo semplice ed efficace.",
            services_title: "Cosa Facciamo",
            srv_social: "Gestione e Creazione di<br>Social Media",
            srv_email: "Campagne di<br>E-mail Marketing",
            srv_photo: "Fotografia Professionale<br>e Video",
            srv_web: "Sviluppo di<br>Siti Web Moderni",
            srv_events: "Organizzazione e Promozione<br>di Eventi",
            target_title: "Con Chi Lavoriamo?",
            target_1: "piccole e medie imprese",
            target_2: "marchi del turismo e del lifestyle",
            target_3: "attività nautiche e yachting sull'Adriatico",
            gallery_title: "I Nostri Lavori",
            banner_title: "Il tuo marchio è sulla rotta giusta!",
            why_title: "Perché scegliere AKB creative house?",
            why_1_title: "Approccio Personale",
            why_1_desc: "Lavori direttamente con me.",
            why_2_title: "Strategia Chiara",
            why_2_desc: "Nessun vagabondaggio verso l'obiettivo.",
            why_3_title: "Visual Premium",
            why_3_desc: "Estetica che vende con affidabilità.",
            why_4_title: "Flessibilità",
            why_4_desc: "Ci adattiamo al tuo ritmo e alla stagione, ma contattaci in tempo!",
            footer_desc: "Forniamo una direzione chiara, forti elementi visivi e una crescita stabile.",
            footer_contact_title: "Contattaci",
            footer_rights: "Tutti i diritti riservati.",
            modal_title: "Invia una Richiesta",
            modal_name: "Il tuo Nome:",
            modal_name_ph: "es. Mario Rossi",
            modal_contact: "La tua Email o Telefono:",
            modal_contact_ph: "es. mario@email.com o +39...",
            modal_type: "Tipo di Richiesta:",
            modal_reg: "Regolare",
            modal_urg: "Urgente!",
            modal_msg: "Il tuo messaggio / descrizione del progetto:",
            modal_msg_ph: "Descrivi come possiamo aiutarti...",
            modal_submit: "Invia Richiesta"
        },
        pt: {
            nav_about: "Sobre nós",
            nav_services: "Serviços",
            nav_gallery: "Galeria",
            nav_why: "Porquê nós",
            nav_contact: "Contacto",
            hero_title: "Sente que está preso nas ondas?",
            hero_subtitle: "Contacte-nos e teremos todo o gosto em criar águas calmas para o seu negócio.",
            about_title: "Sobre nós",
            about_desc: "<strong>AKB CREATIVE HOUSE</strong> é uma agência digital criativa inspirada no Adriático, criada com o objetivo de proporcionar às PME e às marcas de iates uma direção clara, visuais fortes e um crescimento estável.",
            about_mission_title: "A Nossa Missão",
            about_mission_desc: "Ajudamos pequenas e médias empresas, especialmente no turismo e hotelaria, a construir uma forte presença online através do desenvolvimento de websites modernos e gestão de redes sociais.",
            about_vision_title: "A Nossa Visão",
            about_vision_desc: "Tornarmo-nos um parceiro de confiança para empreendedores na Croácia e não só, que pretendem melhorar o seu negócio digital de forma simples e eficaz.",
            services_title: "O Que Fazemos",
            srv_social: "Gestão e Criação de<br>Redes Sociais",
            srv_email: "Campanhas de<br>E-mail Marketing",
            srv_photo: "Fotografia Profissional<br>e Vídeo",
            srv_web: "Desenvolvimento de<br>Websites Modernos",
            srv_events: "Organização e Promoção<br>de Eventos",
            target_title: "Com Quem Trabalhamos?",
            target_1: "pequenas e médias empresas",
            target_2: "marcas de turismo e estilo de vida",
            target_3: "negócios náuticos e de iates no Adriático",
            gallery_title: "O Nosso Trabalho",
            banner_title: "A sua marca está na rota certa!",
            why_title: "Porquê escolher a AKB creative house?",
            why_1_title: "Abordagem Pessoal",
            why_1_desc: "Trabalha diretamente comigo.",
            why_2_title: "Estratégia Clara",
            why_2_desc: "Sem deambular até ao objetivo.",
            why_3_title: "Visual Premium",
            why_3_desc: "Estética que vende de forma fiável.",
            why_4_title: "Flexibilidade",
            why_4_desc: "Adaptamo-nos ao seu ritmo e estação do ano, mas contacte-nos atempadamente!",
            footer_desc: "Proporcionamos uma direção clara, visuais fortes e crescimento estável.",
            footer_contact_title: "Contacte-nos",
            footer_rights: "Todos os direitos reservados.",
            modal_title: "Enviar um Pedido",
            modal_name: "O seu Nome:",
            modal_name_ph: "ex. João Silva",
            modal_contact: "O seu Email ou Telefone:",
            modal_contact_ph: "ex. joao@email.com ou +351...",
            modal_type: "Tipo de Pedido:",
            modal_reg: "Regular",
            modal_urg: "Urgente!",
            modal_msg: "A sua mensagem / descrição do projeto:",
            modal_msg_ph: "Descreva como podemos ajudá-lo...",
            modal_submit: "Enviar Pedido"
        }
    };

    const langBtns = document.querySelectorAll('.lang-btn');
    
    // Funkcija za postavljanje jezika
    function setLanguage(lang) {
        // Spremi odabir u localStorage
        localStorage.setItem('akb_lang', lang);
        
        // Ažuriraj aktivno stanje na gumbima (zastavicama)
        langBtns.forEach(btn => {
            if(btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Prevedi sve elemente sa data-i18n
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key]; // innerHTML zbog boldanih HTML tagova u `about_desc` i uslugama
            }
        });

        // Prevedi placeholdere
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });
        
        // Ažuriraj gumb unutar Web3Forms submit logike
        const submitBtn = document.querySelector('.submit-btn');
        if(submitBtn && !submitBtn.disabled) {
             submitBtn.innerText = translations[lang]['modal_submit'];
        }
    }

    // Klik na zastavicu
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const chosenLang = e.currentTarget.getAttribute('data-lang');
            setLanguage(chosenLang);
            // Automatski zatvori mobilni izbornik nakon klika na jezik
            if(window.innerWidth <= 992) {
                hamburger.classList.remove('open');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Provjeri postoji li već odabrani jezik pri učitavanju
    const savedLang = localStorage.getItem('akb_lang') || 'hr';
    setLanguage(savedLang);

});
