import React, { useRef, useState, useCallback, useMemo } from 'react';
import { Box, Container, Typography, TextField, Alert, CircularProgress } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import CustomButton from '../ui/CustomButton';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.3,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.95,
  },
};

// Alert variants
const alertVariants = {
  hidden: { opacity: 0, y: -20, height: 0 },
  visible: {
    opacity: 1,
    y: 0,
    height: 'auto',
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    height: 0,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

interface FormData {
  name: string;
  email: string;
  message: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.2,
    margin: '-50px 0px -50px 0px',
  });

  const isFormInView = useInView(formRef, {
    once: true,
    amount: 0.2,
  });

  // Memoized handlers
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ name: '', email: '', message: '' });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('https://formsubmit.co/ajax/piyushkdbittu@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `New contact form submission from ${formData.name}`,
          _template: 'table',
        }),
      });

      const data = await response.json();

      if (data.success === 'true') {
        setStatus('success');
        resetForm();

        // Reset status after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      setStatus('error');
      setErrorMessage('There was a problem sending your message. Please try again later.');

      // Reset error status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  }, [formData, resetForm]);

  // Memoized status alerts
  const statusAlert = useMemo(() => {
    if (status === 'success') {
      return (
        <motion.div
          variants={alertVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            Your message has been sent successfully! We&apos;ll get back to you soon.
          </Alert>
        </motion.div>
      );
    }
    if (status === 'error') {
      return (
        <motion.div
          variants={alertVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {errorMessage}
          </Alert>
        </motion.div>
      );
    }
    return null;
  }, [status, errorMessage]);

  return (
    <Box
      ref={sectionRef}
      id="contact"
      sx={{
        py: { xs: 8, md: 10 },
        px: 2,
        position: 'relative',
        willChange: 'transform',
      }}
    >
      <Container maxWidth="md">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{ willChange: 'transform, opacity' }}
        >
          <Box
            sx={{
              background:
                'transparent linear-gradient(180deg, rgba(0, 238, 255, 0.67) 0%, rgba(0, 238, 255, 0.05) 100%)',
              borderRadius: '16px',
              padding: { xs: 2, sm: 3, md: 4 },
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              boxShadow: '0 0 10px rgba(129, 129, 129, 0.81)',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 0 13px 6px rgba(0, 249, 241, 0.81)',
              },
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <Typography
              variant="h2"
              component="h2"
              align="center"
              sx={{
                mb: { xs: 4, md: 6 },
                color: '#fff',
                fontWeight: 700,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                WebkitFontSmoothing: 'antialiased',
              }}
            >
              Get In Touch
            </Typography>

            {/* Status Alerts */}
            {statusAlert}

            <motion.div
              ref={formRef}
              variants={formVariants}
              initial="hidden"
              animate={isFormInView ? 'visible' : 'hidden'}
              style={{ willChange: 'transform, opacity' }}
            >
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <motion.div variants={fieldVariants}>
                  <TextField
                    name="name"
                    label="Your Name"
                    variant="outlined"
                    fullWidth
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={status === 'submitting'}
                    sx={{
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255,255,255,0.7)',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#00c8ff',
                      },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255,255,255,0.4)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00c8ff',
                        },
                      },
                    }}
                  />
                </motion.div>

                <motion.div variants={fieldVariants}>
                  <TextField
                    name="email"
                    label="Your Email"
                    variant="outlined"
                    fullWidth
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={status === 'submitting'}
                    sx={{
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255,255,255,0.7)',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#00c8ff',
                      },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255,255,255,0.4)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00c8ff',
                        },
                      },
                    }}
                  />
                </motion.div>

                <motion.div variants={fieldVariants}>
                  <TextField
                    name="message"
                    label="Your Message"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={status === 'submitting'}
                    sx={{
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255,255,255,0.7)',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#00c8ff',
                      },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255,255,255,0.4)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00c8ff',
                        },
                      },
                    }}
                  />
                </motion.div>

                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    willChange: 'transform',
                  }}
                >
                  <CustomButton
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={status === 'submitting'}
                    sx={{
                      px: { xs: 4, md: 6 },
                      py: 1.5,
                      fontSize: '1.1rem',
                      minWidth: 160,
                      background: 'linear-gradient(135deg, #00c8ff, #00ffc8)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 10px 30px rgba(0,200,255,0.3)',
                      },
                      '&:disabled': {
                        background: 'rgba(255,255,255,0.2)',
                      },
                    }}
                  >
                    {status === 'submitting' ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Send Message'
                    )}
                  </CustomButton>
                </motion.div>
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Contact;