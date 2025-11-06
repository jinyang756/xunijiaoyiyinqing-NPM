import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { useSimulationStore } from '../store/simulationStore'
import { useAccountStore } from '../store/accountStore'

export const exportToCSV = (data: any[], filename: string) => {
  // 转换为工作簿
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  
  // 生成Excel文件
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  
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