"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Heading from "../ui/Heading";
import MagicButton from "../ui/MagicButton";

// Enable ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Form field type
type FormField = {
  name: string;
  value: string;
  error: string;
  focused?: boolean;
};

const ContactSection = () => {
  // Form state
  const [formFields, setFormFields] = useState<FormField[]>([
    { name: "name", value: "", error: "" },
    { name: "email", value: "", error: "" },
    { name: "message", value: "", error: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Refs for GSAP animations
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  // For Framer Motion animations
  const controls = useAnimation();
  const isInView = useInView(contactSectionRef, { once: false, amount: 0.3 });

  // Initialize GSAP animations
  useEffect(() => {
    if (!contactSectionRef.current) return;

    // Create particles for background effect
    const particlesContainer = particlesRef.current;
    if (particlesContainer) {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div");
        particle.className = "absolute rounded-full bg-indigo-500 opacity-20";

        // Random size between 5-20px
        const size = Math.random() * 15 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random position within container
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        particlesContainer.appendChild(particle);

        // Animate each particle with GSAP
        gsap.to(particle, {
          x: `${(Math.random() - 0.5) * 100}`,
          y: `${(Math.random() - 0.5) * 100}`,
          opacity: Math.random() * 0.5,
          duration: 5 + Math.random() * 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }

    // Title animation with GSAP ScrollTrigger
    if (titleRef.current && subtitleRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: contactSectionRef.current,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      }).from(
        subtitleRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
        },
        "-=0.4"
      );
    }

    // Map reveal animation
    if (mapRef.current) {
      gsap.from(mapRef.current, {
        scrollTrigger: {
          trigger: mapRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Framer Motion animations based on view
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  // Form handling
  const handleInputChange = (index: number, value: string) => {
    const updatedFields = [...formFields];
    updatedFields[index].value = value;

    // Clear error when user types
    if (updatedFields[index].error) {
      updatedFields[index].error = "";
    }

    setFormFields(updatedFields);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const updatedFields = [...formFields];

    // Validate name
    if (!updatedFields[0].value.trim()) {
      updatedFields[0].error = "Name is required";
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!updatedFields[1].value.trim()) {
      updatedFields[1].error = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(updatedFields[1].value)) {
      updatedFields[1].error = "Please enter a valid email";
      isValid = false;
    }

    // Validate message
    if (!updatedFields[2].value.trim()) {
      updatedFields[2].error = "Message is required";
      isValid = false;
    }

    setFormFields(updatedFields);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Form animation on success
      if (formRef.current) {
        gsap.to(formRef.current, {
          y: -10,
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            setSubmitSuccess(true);
            // Reset animation
            gsap.fromTo(
              formRef.current,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, delay: 0.2 }
            );
          },
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormFields([
      { name: "name", value: "", error: "" },
      { name: "email", value: "", error: "" },
      { name: "message", value: "", error: "" },
    ]);
    setSubmitSuccess(false);
  };

  const inputVariants = {
    focus: { scale: 1.02, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)" },
    blur: { scale: 1, boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)" },
  };

  const formFieldVariants = {
    hidden: (i: number) => ({
      opacity: 0,
      y: 20,
      transition: { duration: 0.5, delay: i * 0.1 },
    }),
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1 },
    }),
  };

  return (
    <div
      ref={contactSectionRef}
      className="relative py-24 bg-transparent overflow-hidden"
    >
      {/* Particles background */}
      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Heading text="Get in" highlightedText="Touch" className="" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <div className="bg-slate-950/50 rounded-2xl shadow-xl p-8 md:p-10 relative z-10">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 bg-indigo-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-100 mb-2">
                    Thank you!
                  </h3>
                  <p className="text-gray-200 mb-6">
                    Your message has been sent successfully. We'll get back to
                    you soon.
                  </p>
                  <MagicButton
                    title="Send Another Message"
                    icon={null}
                    position="center"
                    handleClick={resetForm}
                    otherClasses="!bg-[#161A31]"
                  />
                </motion.div>
              ) : (
                <>
                  {formFields.map((field, index) => (
                    <motion.div
                      key={field.name}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={formFieldVariants}
                      className="relative"
                    >
                      {field.name === "message" ? (
                        <motion.textarea
                          whileFocus="focus"
                          animate={formFields[index].focused ? "focus" : "blur"}
                          variants={inputVariants}
                          id={field.name}
                          name={field.name}
                          value={field.value}
                          rows={4}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value)
                          }
                          onFocus={() => {
                            const updatedFields = [...formFields];
                            updatedFields[index].focused = true;
                            setFormFields(updatedFields);
                          }}
                          onBlur={() => {
                            const updatedFields = [...formFields];
                            updatedFields[index].focused = false;
                            setFormFields(updatedFields);
                          }}
                          className={`block w-full px-4 py-3 rounded-lg border ${
                            field.error ? "border-red-500" : "border-gray-300"
                          } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300`}
                          placeholder={`Your ${
                            field.name.charAt(0).toUpperCase() +
                            field.name.slice(1)
                          }`}
                        />
                      ) : (
                        <motion.input
                          whileFocus="focus"
                          animate={formFields[index].focused ? "focus" : "blur"}
                          variants={inputVariants}
                          type={field.name === "email" ? "email" : "text"}
                          id={field.name}
                          name={field.name}
                          value={field.value}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value)
                          }
                          onFocus={() => {
                            const updatedFields = [...formFields];
                            updatedFields[index].focused = true;
                            setFormFields(updatedFields);
                          }}
                          onBlur={() => {
                            const updatedFields = [...formFields];
                            updatedFields[index].focused = false;
                            setFormFields(updatedFields);
                          }}
                          className={`block w-full px-4 py-3 rounded-lg border ${
                            field.error ? "border-red-500" : "border-gray-300"
                          } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300`}
                          placeholder={`Your ${
                            field.name.charAt(0).toUpperCase() +
                            field.name.slice(1)
                          }`}
                        />
                      )}
                      {field.error && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-600"
                        >
                          {field.error}
                        </motion.p>
                      )}
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center"
                  >
                    <MagicButton
                      title={isSubmitting ? "Sending..." : "Send Message"}
                      icon={
                        isSubmitting ? (
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : null
                      }
                      position="center"
                      handleClick={() =>
                        isSubmitting
                          ? undefined
                          : handleSubmit(
                              new Event("submit") as unknown as React.FormEvent
                            )
                      }
                      otherClasses={`!bg-[#161A31] ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    />
                  </motion.div>
                </>
              )}
            </form>
          </div>

          {/* Map & Info */}
          <div ref={mapRef} className="space-y-8">
            <div className="overflow-hidden rounded-xl shadow-lg h-64 md:h-80 relative">
              {/* GIF display instead of map */}
              <div className="absolute inset-0 bg-gray-900/30 flex items-center justify-center">
                <img
                  src="/images/send4.gif"
                  alt="Contact us animation"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.3,
                  },
                },
              }}
            >
              {/* Contact Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    ),
                    title: "Phone",
                    content: "+1 (555) 123-4567",
                  },
                  {
                    icon: (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    ),
                    title: "Email",
                    content: "contact@example.com",
                  },
                  {
                    icon: (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    ),
                    title: "Address",
                    content: "123 Innovation St, Tech City",
                  },
                  {
                    icon: (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ),
                    title: "Hours",
                    content: "Mon-Fri: 9AM - 6PM",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{
                      y: -5,
                      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                    }}
                    className="bg-slate-500/50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <div className="rounded-full bg-slate-900 text-indigo-600 p-3 mr-4">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-300">
                          {item.title}
                        </h3>
                        <p className="text-gray-400">{item.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
