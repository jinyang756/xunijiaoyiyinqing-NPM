import { saveAs } from 'file-saver'
import { useSimulationStore } from '../store/simulationStore'
import { useAccountStore } from '../store/accountStore'

export const exportToCSV = async <T extends Record<string, any>>(data: T[], filename: string) => {
  // 动态导入ExcelJS以减少初始打包体积
  const ExcelJS = await import('exceljs')
  
  // 创建工作簿
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Sheet1')
  
  // 如果有数据，添加表头和数据
  if (data.length > 0) {
    // 添加表头
    const headers = Object.keys(data[0])
    worksheet.addRow(headers)
    
    // 添加数据行
    data.forEach(item => {
      const row = headers.map(header => item[header])
      worksheet.addRow(row)
    })
  }
  
  // 生成Excel文件
  const buffer = await workbook.xlsx.writeBuffer()
  const dataBlob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  
  // 下载文件
  saveAs(dataBlob, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`)
}

// 导出基金合约数据
export const exportFundContracts = () => {
  const { contracts } = useSimulationStore.getState()
  exportToCSV(contracts, 'fund_contracts')
}

// 导出交易记录
export const exportTrades = () => {
  const { accounts } = useAccountStore.getState()
  if (accounts.length > 0 && accounts[0].trades) {
    exportToCSV(accounts[0].trades, 'trades')
  }
}