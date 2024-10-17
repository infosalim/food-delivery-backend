import { Request, Response, NextFunction } from 'express';
import { CreateVendor, GetVendors, GetVendorByID } from '../../controllers';
import { Vendor } from '../../models';
import { GeneratePassword, GenerateSalt } from '../../utility';

// Mock dependencies
jest.mock('../../models');
jest.mock('../../utility');

describe('Vendor Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let jsonResponse: jest.Mock;

  beforeEach(() => {
    jsonResponse = jest.fn();
    mockRequest = {};
    mockResponse = {
      json: jsonResponse,
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  // Test for CreateVendor
  describe('CreateVendor', () => {
    it('should return 400 if a vendor already exists with the same email', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        phone: '1234567890',
        password: 'password123',
      };

      // Mock Vendor.findOne to simulate an existing vendor
      (Vendor.findOne as jest.Mock).mockResolvedValueOnce({
        email: 'test@example.com',
      });

      await CreateVendor(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message:
          'A vendor is already created with this Email ID or Phone Number!',
      });
    });

    it('should create a new vendor if email is not already taken', async () => {
      mockRequest.body = {
        name: 'Vendor Name',
        ownerName: 'Owner Name',
        address: 'Address',
        pincode: '123456',
        foodType: 'Italian',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
      };

      // Mock no vendor found with the same email
      (Vendor.findOne as jest.Mock).mockResolvedValueOnce(null);

      // Mock salt and password generation
      (GenerateSalt as jest.Mock).mockResolvedValueOnce('salt');
      (GeneratePassword as jest.Mock).mockResolvedValueOnce(
        'encryptedPassword'
      );

      // Mock Vendor.create to simulate vendor creation
      (Vendor.create as jest.Mock).mockResolvedValueOnce({
        ...mockRequest.body,
        password: 'encryptedPassword',
        salt: 'salt',
        rating: 0,
        serviceAvailable: false,
        coverImage: [],
        foods: [],
      });

      await CreateVendor(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(Vendor.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          password: 'encryptedPassword',
          phone: '1234567890',
        })
      );

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          phone: '1234567890',
        })
      );
    });
  });

  // Test for GetVendors
  describe('GetVendors', () => {
    it('should return all vendors', async () => {
      const vendors = [{ name: 'Vendor 1' }, { name: 'Vendor 2' }];

      // Mock Vendor.find to return a list of vendors
      (Vendor.find as jest.Mock).mockResolvedValueOnce(vendors);

      await GetVendors(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith(vendors);
    });

    it('should return 404 if no vendors are found', async () => {
      // Mock Vendor.find to return an empty array
      (Vendor.find as jest.Mock).mockResolvedValueOnce([]);

      await GetVendors(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Vendors data not available',
      });
    });
  });

  // Test for GetVendorByID
  describe('GetVendorByID', () => {
    it('should return vendor data if a valid vendor ID is provided', async () => {
      const vendor = { name: 'Vendor 1' };

      // Mock FindVendor to return a vendor
      (Vendor.findById as jest.Mock).mockResolvedValueOnce(vendor);

      mockRequest.params = { id: '1' };

      await GetVendorByID(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith(vendor);
    });

    it('should return 404 if no vendor is found for the given ID', async () => {
      // Mock FindVendor to return null
      (Vendor.findById as jest.Mock).mockResolvedValueOnce(null);

      mockRequest.params = { id: '1' };

      await GetVendorByID(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Vendor data not available',
      });
    });

    it('should return 500 if there is an error', async () => {
      const error = new Error('Database error');
      (Vendor.findById as jest.Mock).mockRejectedValueOnce(error);

      mockRequest.params = { id: '1' };

      await GetVendorByID(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'An error occurred',
        error: 'Database error',
      });
    });
  });
});
