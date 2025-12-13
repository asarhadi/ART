# Admin Portal Setup Guide

## Creating Admin Users

To access the admin ticketing dashboard, you need to create admin users in Supabase. Follow these steps:

### Method 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: American Reliable Tech

2. **Navigate to Authentication**
   - Click on "Authentication" in the left sidebar
   - Click on "Users" tab

3. **Add New User**
   - Click the "Add user" button
   - Choose "Create new user"
   - Enter the admin email (e.g., `admin@americanreliabletech.com`)
   - Enter a secure password
   - Click "Create user"

4. **Verify Email (Optional)**
   - If email confirmation is enabled, you may need to verify the email
   - You can disable email confirmation in Authentication > Settings for admin users

### Method 2: Using Supabase Auth API

You can also create users programmatically using the Supabase Admin API:

\`\`\`javascript
const { data, error } = await supabase.auth.admin.createUser({
  email: 'admin@americanreliabletech.com',
  password: 'secure-password-here',
  email_confirm: true
})
\`\`\`

## Logging In

1. **Access the Admin Login Page**
   - Go to: `https://your-domain.com/admin/login`
   - Or click the user icon on the far left of the navigation bar (only visible on the Support page)

2. **Enter Credentials**
   - Email: The admin email you created in Supabase
   - Password: The password you set

3. **Access Dashboard**
   - After successful login, you'll be redirected to `/admin/dashboard`
   - You can view, search, filter, and manage all support tickets

## Recommended Admin Accounts

Create these admin accounts for your team:

- `admin@americanreliabletech.com` - Primary admin account
- `support@americanreliabletech.com` - Support team account
- Individual team member emails as needed

## Security Notes

- Use strong passwords for all admin accounts
- Enable two-factor authentication in Supabase if available
- Regularly review and audit admin user access
- The admin portal is protected by Supabase Row Level Security (RLS)
- Only authenticated users can access ticket data

## Troubleshooting

**Can't login?**
- Verify the user exists in Supabase Dashboard > Authentication > Users
- Check that the email is confirmed (or disable email confirmation)
- Ensure the password is correct
- Check browser console for any errors

**Can't see tickets?**
- Ensure the SQL scripts have been run (001_create_tickets_table.sql and 002_setup_admin_auth.sql)
- Verify RLS policies are enabled
- Check that you're logged in (check browser dev tools > Application > Cookies)

## Admin Portal Features

Once logged in, you can:
- View all support tickets in a colorful dashboard
- Search tickets by ticket number, email, subject, or description
- Filter tickets by status, priority, and category
- Sort tickets by any column
- View detailed ticket information
- Update ticket status
- Add internal admin notes
- See real-time statistics (total, open, in-progress, resolved tickets)
