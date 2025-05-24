import React from "react"

import { CopyrightIcon, FacebookIcon, LinkedinIcon, TwitterXIcon } from "@icons"

const footerLinks = [
  {
    title: "Company",
    links: [
      { name: "About us", href: "/" },
      { name: "Contact Us", href: "/" },
      { name: "Careers", href: "/" },
      { name: "Press", href: "/" },
    ],
  },
  {
    title: "Help",
    links: [
      { name: "FAQs", href: "/" },
      { name: "How it works", href: "/" },
      { name: "Privacy policy", href: "/" },
    ],
  },
  {
    title: "Get in touch",
    links: [
      {
        name: "customerservice@dashbite.com",
        href: "mailto:customerservice@dashbite.com",
      },
      { name: "1-800-267-8097", href: "tel:18002678097" },
    ],
  },
]

const icons = [
  { image: LinkedinIcon, alt: "Linkedin Icon" },
  { image: TwitterXIcon, alt: "Twitter X Icon" },
  { image: FacebookIcon, alt: "Facebook Icon" },
]

const Footer = () => {
  return (
    <footer className="bg-foreground px-40 pb-10 pt-20">
      <div className="flex flex-wrap items-start justify-between gap-20 max-lg:flex-col">
        <div className="flex flex-col items-start">
          <a href="/">
            <p className="text-border text-3xl font-extrabold not-italic">
              DashBite
            </p>
          </a>
          <p className="md:w-2xs text-muted mt-6 max-w-sm text-base leading-7">
            DashBite is a dynamic food delivery platform that connects
            restaurants and customers seamlessly.
          </p>
          <div className="mt-8 flex items-center gap-5">
            {icons.map((icon) => (
              <div
                className="flex h-12 w-12 cursor-pointer items-center justify-center hover:-translate-y-1 hover:transition"
                key={icon.alt}
              >
                <img
                  src={icon.image}
                  alt={icon.alt}
                  width={10}
                  height={10}
                  className="h-8 w-auto"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-wrap justify-between gap-20 lg:gap-10">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <p className="text-muted mb-6 text-base uppercase">
                {section.title}
              </p>
              <ul>
                {section.links.map((link) => (
                  <li
                    className="text-border font-sf_text mt-3 text-lg font-normal tracking-[-0.2px] hover:font-bold"
                    key={link.name}
                  >
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="text-muted mt-24 flex justify-between max-sm:flex-col max-sm:items-center">
        <div className="flex cursor-pointer items-end gap-3">
          <img src={CopyrightIcon} alt="copyright sign" className="my-1" />
          <p>Copyright. All rights reserved.</p>
        </div>
        <p className="cursor-pointer">Terms & Conditions</p>
      </div>
    </footer>
  )
}

export default Footer
