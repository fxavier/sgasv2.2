'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, Plus } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';
import { uploadFileToS3 } from '@/lib/upload-service';

// Define missing interface
interface PhotoDocumentProvingClosure {
  id: string;
  photo: string;
  document: string;
  createdBy: string;
  created_at?: string;
  updated_at?: string;
}

// Extend ComplaintAndClaimRecord interface
export interface ComplaintAndClaimRecord {
  id: string;
  number: string;
  date_occurred: string;
  local_occurrence: string;
  how_occurred: string;
  who_involved: string;
  report_and_explanation: string;
  claim_local_occurrence: string;
  complaintant_gender: 'MALE' | 'FEMALE';
  complaintant_age: number;
  anonymous_complaint: 'YES' | 'NO';
  telephone: string;
  email?: string;
  complaintant_address: string;
  complaintant_accepted: 'YES' | 'NO';
  action_taken: string;
  complaintant_notified: 'YES' | 'NO';
  notification_method: string;
  closing_date: string;
  claim_category:
    | 'Odor'
    | 'Noise'
    | 'Effluents'
    | 'Company vehicles'
    | 'Flow of migrant workers'
    | 'Security personnel'
    | 'GBV/SA/SEA'
    | 'Other';
  other_claim_category?: string;
  inspection_date: string;
  collected_information: 'Photos' | 'Proof of legitimacy documents';
  resolution_type:
    | 'Internal resolution'
    | 'Second level resolution'
    | 'Third level resolution';
  resolution_date: string;
  resolution_submitted: 'YES' | 'NO';
  corrective_action_taken: string;
  involved_in_resolution: string;
  complaintant_satisfaction: 'SATISFIED' | 'NOT_SATISFIED';
  photos_and_documents_proving_closure?: PhotoDocumentProvingClosure[];
  resources_spent: number;
  number_of_days_since_received_to_closure: number;
  monitoring_after_closure: 'YES' | 'NO';
  monitoring_method_and_frequency: string;
  follow_up: string;
  involved_institutions?: string;
  suggested_preventive_actions: string;
}

// Form for adding new photo document
const photoDocumentFormSchema = z.object({
  createdBy: z.string().min(2, 'Creator name must be at least 2 characters'),
});

function PhotoDocumentDialog({
  open,
  onOpenChange,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onSuccess: (photoDocument: PhotoDocumentProvingClosure) => void;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof photoDocumentFormSchema>>({
    resolver: zodResolver(photoDocumentFormSchema),
    defaultValues: {
      createdBy: '',
    },
  });

  // Reset file inputs when dialog closes
  useEffect(() => {
    if (!open) {
      setPhotoFile(null);
      setDocumentFile(null);
      setUploadError(null);
    }
  }, [open]);

  const onSubmit = async (values: z.infer<typeof photoDocumentFormSchema>) => {
    try {
      // Validate that at least one file is selected
      if (!photoFile && !documentFile) {
        setUploadError('Please select at least one file (photo or document)');
        return;
      }

      setIsSubmitting(true);
      setUploadError(null);

      let photoUrl = '';
      let documentUrl = '';

      // Upload photo file if provided
      if (photoFile) {
        try {
          photoUrl = await uploadFileToS3(photoFile);
          console.log('Photo uploaded successfully:', photoUrl);
        } catch (error) {
          console.error('Error uploading photo:', error);
          throw new Error('Failed to upload photo. Please try again.');
        }
      }

      // Upload document file if provided
      if (documentFile) {
        try {
          documentUrl = await uploadFileToS3(documentFile);
          console.log('Document uploaded successfully:', documentUrl);
        } catch (error) {
          console.error('Error uploading document:', error);
          throw new Error('Failed to upload document. Please try again.');
        }
      }

      // Create the photo document record
      const photoDocumentData = {
        photo: photoUrl,
        document: documentUrl,
        createdBy: values.createdBy,
      };

      console.log('Submitting photo document data:', photoDocumentData);

      const response = await fetch('/api/photo-documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(photoDocumentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create photo document');
      }

      const photoDocument = await response.json();

      toast({
        title: 'Photo document created',
        description: 'The photo document has been successfully created.',
      });

      form.reset();
      setPhotoFile(null);
      setDocumentFile(null);
      onSuccess(photoDocument);
      onClose();
    } catch (error) {
      console.error('Error creating photo document:', error);
      setUploadError(
        error instanceof Error
          ? error.message
          : 'There was an error creating the photo document. Please try again.'
      );
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'There was an error creating the photo document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Add Photo and Document</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='flex flex-col gap-2'>
              <FormLabel htmlFor='photo-file'>Photo</FormLabel>
              <Input
                id='photo-file'
                type='file'
                accept='image/*'
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setPhotoFile(file);
                  setUploadError(null);
                }}
              />
              {photoFile && (
                <p className='text-sm text-muted-foreground'>
                  Selected: {photoFile.name}
                </p>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <FormLabel htmlFor='document-file'>Document</FormLabel>
              <Input
                id='document-file'
                type='file'
                accept='.pdf,.doc,.docx,.txt'
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setDocumentFile(file);
                  setUploadError(null);
                }}
              />
              {documentFile && (
                <p className='text-sm text-muted-foreground'>
                  Selected: {documentFile.name}
                </p>
              )}
            </div>

            <FormField
              control={form.control}
              name='createdBy'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Created By</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter creator name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {uploadError && (
              <div className='text-sm font-medium text-destructive'>
                {uploadError}
              </div>
            )}

            <div className='flex justify-end gap-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const formSchema = z.object({
  number: z.string().min(1, 'Number is required'),
  date_occurred: z.string(),
  local_occurrence: z.string().min(2, 'Location must be at least 2 characters'),
  how_occurred: z
    .string()
    .min(10, 'Description must be at least 10 characters'),
  who_involved: z.string().min(2, 'Who involved must be at least 2 characters'),
  report_and_explanation: z
    .string()
    .min(10, 'Report must be at least 10 characters'),
  claim_local_occurrence: z
    .string()
    .min(2, 'Claim location must be at least 2 characters'),
  complaintant_gender: z.enum(['MALE', 'FEMALE']),
  complaintant_age: z.number().min(1, 'Age must be at least 1'),
  anonymous_complaint: z.enum(['YES', 'NO']),
  telephone: z.string().min(5, 'Telephone must be at least 5 characters'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  complaintant_address: z
    .string()
    .min(5, 'Address must be at least 5 characters'),
  complaintant_accepted: z.enum(['YES', 'NO']),
  action_taken: z
    .string()
    .min(10, 'Action taken must be at least 10 characters'),
  complaintant_notified: z.enum(['YES', 'NO']),
  notification_method: z
    .string()
    .min(2, 'Notification method must be at least 2 characters'),
  closing_date: z.string(),
  claim_category: z.enum([
    'Odor',
    'Noise',
    'Effluents',
    'Company vehicles',
    'Flow of migrant workers',
    'Security personnel',
    'GBV/SA/SEA',
    'Other',
  ]),
  other_claim_category: z.string().optional(),
  inspection_date: z.string(),
  collected_information: z.enum(['Photos', 'Proof of legitimacy documents']),
  resolution_type: z.enum([
    'Internal resolution',
    'Second level resolution',
    'Third level resolution',
  ]),
  resolution_date: z.string(),
  resolution_submitted: z.enum(['YES', 'NO']),
  corrective_action_taken: z
    .string()
    .min(10, 'Corrective action must be at least 10 characters'),
  involved_in_resolution: z
    .string()
    .min(2, 'Involved in resolution must be at least 2 characters'),
  complaintant_satisfaction: z.enum(['SATISFIED', 'NOT_SATISFIED']),
  photos_and_documents_proving_closure: z
    .array(
      z.object({
        id: z.string(),
        photo: z.string(),
        document: z.string(),
        createdBy: z.string(),
        created_at: z.string().optional(),
        updated_at: z.string().optional(),
      })
    )
    .optional(),
  resources_spent: z.number().min(0, 'Resources spent must be 0 or greater'),
  number_of_days_since_received_to_closure: z
    .number()
    .min(0, 'Days must be 0 or greater'),
  monitoring_after_closure: z.enum(['YES', 'NO']),
  monitoring_method_and_frequency: z
    .string()
    .min(5, 'Monitoring method must be at least 5 characters'),
  follow_up: z.string().min(5, 'Follow up must be at least 5 characters'),
  involved_institutions: z.string().optional(),
  suggested_preventive_actions: z
    .string()
    .min(10, 'Preventive actions must be at least 10 characters'),
});

interface ComplaintsRegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: ComplaintAndClaimRecord | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ComplaintsRegistrationForm({
  open,
  onOpenChange,
  complaint,
  onClose,
  onSuccess,
}: ComplaintsRegistrationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photoDocuments, setPhotoDocuments] = useState<
    PhotoDocumentProvingClosure[]
  >([]);
  const [isAddPhotoDocumentOpen, setIsAddPhotoDocumentOpen] = useState(false);

  // Fetch photo documents
  useEffect(() => {
    if (open) {
      const fetchPhotoDocuments = async () => {
        try {
          setIsLoading(true);
          const response = await fetch('/api/photo-documents');
          if (!response.ok) {
            throw new Error('Failed to fetch photo documents');
          }
          const data = await response.json();
          setPhotoDocuments(data);
        } catch (error) {
          console.error('Error fetching photo documents:', error);
          toast({
            title: 'Error',
            description: 'Failed to load photo documents. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchPhotoDocuments();
    }
  }, [open, toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: complaint?.number || '',
      date_occurred:
        complaint?.date_occurred || format(new Date(), 'yyyy-MM-dd'),
      local_occurrence: complaint?.local_occurrence || '',
      how_occurred: complaint?.how_occurred || '',
      who_involved: complaint?.who_involved || '',
      report_and_explanation: complaint?.report_and_explanation || '',
      claim_local_occurrence: complaint?.claim_local_occurrence || '',
      complaintant_gender: complaint?.complaintant_gender || 'MALE',
      complaintant_age: complaint?.complaintant_age || 18,
      anonymous_complaint: complaint?.anonymous_complaint || 'NO',
      telephone: complaint?.telephone || '',
      email: complaint?.email || '',
      complaintant_address: complaint?.complaintant_address || '',
      complaintant_accepted: complaint?.complaintant_accepted || 'YES',
      action_taken: complaint?.action_taken || '',
      complaintant_notified: complaint?.complaintant_notified || 'NO',
      notification_method: complaint?.notification_method || '',
      closing_date: complaint?.closing_date || format(new Date(), 'yyyy-MM-dd'),
      claim_category: complaint?.claim_category || 'Other',
      other_claim_category: complaint?.other_claim_category || '',
      inspection_date:
        complaint?.inspection_date || format(new Date(), 'yyyy-MM-dd'),
      collected_information: complaint?.collected_information || 'Photos',
      resolution_type: complaint?.resolution_type || 'Internal resolution',
      resolution_date:
        complaint?.resolution_date || format(new Date(), 'yyyy-MM-dd'),
      resolution_submitted: complaint?.resolution_submitted || 'NO',
      corrective_action_taken: complaint?.corrective_action_taken || '',
      involved_in_resolution: complaint?.involved_in_resolution || '',
      complaintant_satisfaction:
        complaint?.complaintant_satisfaction || 'SATISFIED',
      photos_and_documents_proving_closure:
        complaint?.photos_and_documents_proving_closure || [],
      resources_spent: complaint?.resources_spent || 0,
      number_of_days_since_received_to_closure:
        complaint?.number_of_days_since_received_to_closure || 0,
      monitoring_after_closure: complaint?.monitoring_after_closure || 'NO',
      monitoring_method_and_frequency:
        complaint?.monitoring_method_and_frequency || '',
      follow_up: complaint?.follow_up || '',
      involved_institutions: complaint?.involved_institutions || '',
      suggested_preventive_actions:
        complaint?.suggested_preventive_actions || '',
    },
  });

  // Update form when complaint changes
  useEffect(() => {
    if (complaint) {
      form.reset({
        number: complaint.number,
        date_occurred: complaint.date_occurred,
        local_occurrence: complaint.local_occurrence,
        how_occurred: complaint.how_occurred,
        who_involved: complaint.who_involved,
        report_and_explanation: complaint.report_and_explanation,
        claim_local_occurrence: complaint.claim_local_occurrence,
        complaintant_gender: complaint.complaintant_gender,
        complaintant_age: complaint.complaintant_age,
        anonymous_complaint: complaint.anonymous_complaint,
        telephone: complaint.telephone,
        email: complaint.email || '',
        complaintant_address: complaint.complaintant_address,
        complaintant_accepted: complaint.complaintant_accepted,
        action_taken: complaint.action_taken,
        complaintant_notified: complaint.complaintant_notified,
        notification_method: complaint.notification_method,
        closing_date: complaint.closing_date,
        claim_category: complaint.claim_category,
        other_claim_category: complaint.other_claim_category || '',
        inspection_date: complaint.inspection_date,
        collected_information: complaint.collected_information,
        resolution_type: complaint.resolution_type,
        resolution_date: complaint.resolution_date,
        resolution_submitted: complaint.resolution_submitted,
        corrective_action_taken: complaint.corrective_action_taken,
        involved_in_resolution: complaint.involved_in_resolution,
        complaintant_satisfaction: complaint.complaintant_satisfaction,
        photos_and_documents_proving_closure:
          complaint.photos_and_documents_proving_closure || [],
        resources_spent: complaint.resources_spent,
        number_of_days_since_received_to_closure:
          complaint.number_of_days_since_received_to_closure,
        monitoring_after_closure: complaint.monitoring_after_closure,
        monitoring_method_and_frequency:
          complaint.monitoring_method_and_frequency,
        follow_up: complaint.follow_up,
        involved_institutions: complaint.involved_institutions || '',
        suggested_preventive_actions: complaint.suggested_preventive_actions,
      });
    } else {
      form.reset({
        number: '',
        date_occurred: format(new Date(), 'yyyy-MM-dd'),
        local_occurrence: '',
        how_occurred: '',
        who_involved: '',
        report_and_explanation: '',
        claim_local_occurrence: '',
        complaintant_gender: 'MALE',
        complaintant_age: 18,
        anonymous_complaint: 'NO',
        telephone: '',
        email: '',
        complaintant_address: '',
        complaintant_accepted: 'YES',
        action_taken: '',
        complaintant_notified: 'NO',
        notification_method: '',
        closing_date: format(new Date(), 'yyyy-MM-dd'),
        claim_category: 'Other',
        other_claim_category: '',
        inspection_date: format(new Date(), 'yyyy-MM-dd'),
        collected_information: 'Photos',
        resolution_type: 'Internal resolution',
        resolution_date: format(new Date(), 'yyyy-MM-dd'),
        resolution_submitted: 'NO',
        corrective_action_taken: '',
        involved_in_resolution: '',
        complaintant_satisfaction: 'SATISFIED',
        photos_and_documents_proving_closure: [],
        resources_spent: 0,
        number_of_days_since_received_to_closure: 0,
        monitoring_after_closure: 'NO',
        monitoring_method_and_frequency: '',
        follow_up: '',
        involved_institutions: '',
        suggested_preventive_actions: '',
      });
    }
  }, [complaint, form]);

  const claimCategory = form.watch('claim_category');

  const handlePhotoDocumentSuccess = (
    photoDocument: PhotoDocumentProvingClosure
  ) => {
    // Add the new photo document to the state
    setPhotoDocuments((prev) => [...prev, photoDocument]);

    // Add the new photo document to the form
    const currentPhotoDocuments =
      form.getValues('photos_and_documents_proving_closure') || [];
    form.setValue('photos_and_documents_proving_closure', [
      ...currentPhotoDocuments,
      photoDocument,
    ]);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (complaint) {
        // Update existing complaint
        const response = await fetch(
          `/api/complaints-registration/${complaint.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to update complaint and claim record'
          );
        }

        toast({
          title: 'Record updated',
          description:
            'The complaint and claim record has been successfully updated.',
        });
      } else {
        // Create new complaint
        const response = await fetch('/api/complaints-registration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to create complaint and claim record'
          );
        }

        toast({
          title: 'Record created',
          description:
            'The complaint and claim record has been successfully created.',
        });
      }

      form.reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving complaint and claim record:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'There was an error saving the complaint and claim record. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[800px]'>
          <div className='flex justify-center items-center p-8'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
            <span className='ml-2'>Loading form data...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[800px] h-[90vh] flex flex-col p-0'>
          <DialogHeader className='px-6 py-4 border-b'>
            <DialogTitle>
              {complaint
                ? 'Edit Complaint and Claim Record'
                : 'Create Complaint and Claim Record'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className='flex-1 p-6'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <FormField
                    control={form.control}
                    name='number'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter number' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='date_occurred'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Date Occurred</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                              mode='single'
                              selected={new Date(field.value)}
                              onSelect={(date) =>
                                field.onChange(format(date!, 'yyyy-MM-dd'))
                              }
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='local_occurrence'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location of Occurrence</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter location' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='how_occurred'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How Occurred</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Describe how it occurred'
                          className='min-h-[100px]'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='who_involved'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Who Involved</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter who was involved'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='claim_local_occurrence'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Claim Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter claim location'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='report_and_explanation'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report and Explanation</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Enter report and explanation'
                          className='min-h-[100px]'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <FormField
                    control={form.control}
                    name='complaintant_gender'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complainant Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select gender' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='MALE'>Male</SelectItem>
                            <SelectItem value='FEMALE'>Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='complaintant_age'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complainant Age</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='Enter age'
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='anonymous_complaint'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anonymous Complaint</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='YES'>Yes</SelectItem>
                            <SelectItem value='NO'>No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <FormField
                    control={form.control}
                    name='telephone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telephone</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter telephone' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter email' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='complaintant_address'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complainant Address</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter address' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <FormField
                    control={form.control}
                    name='complaintant_accepted'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complainant Accepted</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='YES'>Yes</SelectItem>
                            <SelectItem value='NO'>No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='complaintant_notified'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complainant Notified</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='YES'>Yes</SelectItem>
                            <SelectItem value='NO'>No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='notification_method'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notification Method</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter notification method'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='action_taken'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Action Taken</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Describe action taken'
                          className='min-h-[100px]'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <FormField
                    control={form.control}
                    name='closing_date'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Closing Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                              mode='single'
                              selected={new Date(field.value)}
                              onSelect={(date) =>
                                field.onChange(format(date!, 'yyyy-MM-dd'))
                              }
                              disabled={(date) => date < new Date('1900-01-01')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='claim_category'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Claim Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select category' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='Odor'>Odor</SelectItem>
                            <SelectItem value='Noise'>Noise</SelectItem>
                            <SelectItem value='Effluents'>Effluents</SelectItem>
                            <SelectItem value='Company vehicles'>
                              Company vehicles
                            </SelectItem>
                            <SelectItem value='Flow of migrant workers'>
                              Flow of migrant workers
                            </SelectItem>
                            <SelectItem value='Security personnel'>
                              Security personnel
                            </SelectItem>
                            <SelectItem value='GBV/SA/SEA'>
                              GBV/SA/SEA
                            </SelectItem>
                            <SelectItem value='Other'>Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {claimCategory === 'Other' && (
                    <FormField
                      control={form.control}
                      name='other_claim_category'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Other Claim Category</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Specify other category'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <FormField
                    control={form.control}
                    name='inspection_date'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Inspection Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                              mode='single'
                              selected={new Date(field.value)}
                              onSelect={(date) =>
                                field.onChange(format(date!, 'yyyy-MM-dd'))
                              }
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='collected_information'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collected Information</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select information type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='Photos'>Photos</SelectItem>
                            <SelectItem value='Proof of legitimacy documents'>
                              Proof of legitimacy documents
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='resolution_type'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resolution Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select resolution type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='Internal resolution'>
                              Internal resolution
                            </SelectItem>
                            <SelectItem value='Second level resolution'>
                              Second level resolution
                            </SelectItem>
                            <SelectItem value='Third level resolution'>
                              Third level resolution
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <FormField
                    control={form.control}
                    name='resolution_date'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Resolution Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                              mode='single'
                              selected={new Date(field.value)}
                              onSelect={(date) =>
                                field.onChange(format(date!, 'yyyy-MM-dd'))
                              }
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='resolution_submitted'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resolution Submitted</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='YES'>Yes</SelectItem>
                            <SelectItem value='NO'>No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='complaintant_satisfaction'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complainant Satisfaction</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select satisfaction' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='SATISFIED'>Satisfied</SelectItem>
                            <SelectItem value='NOT_SATISFIED'>
                              Not Satisfied
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='corrective_action_taken'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corrective Action Taken</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Describe corrective action taken'
                          className='min-h-[100px]'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='involved_in_resolution'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Involved in Resolution</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter who was involved in resolution'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='photos_and_documents_proving_closure'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Photos and Documents Proving Closure
                      </FormLabel>
                      <div className='flex gap-2'>
                        <Select
                          onValueChange={(value) => {
                            const selected = photoDocuments.find(
                              (doc) => doc.id === value
                            );
                            if (selected) {
                              // Check if already selected
                              const isAlreadySelected = field.value?.some(
                                (item) => item.id === selected.id
                              );

                              if (!isAlreadySelected) {
                                field.onChange([
                                  ...(field.value || []),
                                  selected,
                                ]);
                              }
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select photo document' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {photoDocuments.map((doc) => (
                              <SelectItem key={doc.id} value={doc.id}>
                                {doc.createdBy} -{' '}
                                {new Date(doc.created_at!).toLocaleDateString()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type='button'
                          variant='outline'
                          size='icon'
                          onClick={() => setIsAddPhotoDocumentOpen(true)}
                        >
                          <Plus className='h-4 w-4' />
                        </Button>
                      </div>

                      {/* Display selected photo documents */}
                      {field.value && field.value.length > 0 && (
                        <div className='mt-2 space-y-2'>
                          <p className='text-sm font-medium'>
                            Selected photo documents:
                          </p>
                          <ul className='text-sm space-y-1'>
                            {field.value.map((doc) => (
                              <li
                                key={doc.id}
                                className='flex justify-between items-center p-2 bg-gray-50 rounded'
                              >
                                <span>
                                  {doc.createdBy} -{' '}
                                  {new Date(
                                    doc.created_at!
                                  ).toLocaleDateString()}
                                </span>
                                <Button
                                  type='button'
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => {
                                    field.onChange(
                                      field.value?.filter(
                                        (item) => item.id !== doc.id
                                      )
                                    );
                                  }}
                                >
                                  Remove
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='resources_spent'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resources Spent</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='Enter resources spent'
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='number_of_days_since_received_to_closure'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Days Since Received to Closure</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='Enter number of days'
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='monitoring_after_closure'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monitoring After Closure</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='YES'>Yes</SelectItem>
                            <SelectItem value='NO'>No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='monitoring_method_and_frequency'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monitoring Method and Frequency</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter monitoring method and frequency'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='follow_up'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Follow Up</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Enter follow up details'
                          className='min-h-[100px]'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='involved_institutions'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Involved Institutions (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter involved institutions'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='suggested_preventive_actions'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suggested Preventive Actions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Enter suggested preventive actions'
                          className='min-h-[100px]'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </ScrollArea>
          <div className='flex justify-end gap-4 p-6 border-t'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  {complaint ? 'Updating...' : 'Creating...'}
                </>
              ) : complaint ? (
                'Update'
              ) : (
                'Create'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Document Dialog */}
      <PhotoDocumentDialog
        open={isAddPhotoDocumentOpen}
        onOpenChange={setIsAddPhotoDocumentOpen}
        onClose={() => setIsAddPhotoDocumentOpen(false)}
        onSuccess={handlePhotoDocumentSuccess}
      />
    </>
  );
}
