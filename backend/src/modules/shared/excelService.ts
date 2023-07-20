import { Injectable } from '@nestjs/common';
import { json } from 'stream/consumers';
import * as XLSX from 'xlsx';
import * as fs from 'fs';

@Injectable()
export class ExcelService {
  async exportToExcel(users: any[]): Promise<Buffer> {
    try {
        console.log(users);

      const flattenedUsers = users.map(user => {
        return {
          name: user.username,
          wallet: user.wallet,
          isAdmin: user.isAdmin,
          number: user.number,
          block: user.block,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      });
  
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(flattenedUsers);

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
      const buffer = XLSX.write(workbook, { type: 'buffer', bookSST: true }); 
      fs.writeFileSync('user_details.xlsx', buffer);
    
      return buffer;

    } catch (error) {
      throw error; // Re-throw the error to handle it at the caller level
    }
  }
}

